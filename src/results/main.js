if(window.Stagecast) {
    const SDK = new Stagecast();

    /**
     * The Mosaic Vue component.
     */
    const app = new Vue({
        el: '#mosaic',
        data: {
            FETCH_TIMEOUT: 5000,
            FETCH_DELETED_TIMEOUT: 60000,
            tiles: [],
            images: [],
            momentClass: undefined,
            moment: undefined,
            cols: 0,
            logoOverlay: undefined,
            colorOverlay: undefined,
            emptyTileColors: ['#1F1F1F'],
            emptyTileBackground: undefined,
            randomArray: [],
        },
        watch: {
            tiles: function(newTiles, oldTiles) {
                this.updateTileSize();
            },
            images: function(newImages, oldImages) {
                this.onImagesWatch();
            }
        },
        created() {
            this.init();
        },
        methods: {
            init: function() {
                // Receive the config and get the moment class
                SDK.onConfigReceived(() => {

                    Promise.all([
                        SDK.connection.getMomentClass(),
                        SDK.connection.getMoment()
                    ]).then((data) => {
                        this.momentClass = data[0];
                        this.moment = data[1];

                        this.logoOverlay = this.momentClass.custom.mosaicBackgroundImage.length > 0
                            ? this.momentClass.custom.mosaicBackgroundImage[0]
                            : null;

                        this.colorOverlay = this.momentClass.custom.mosaicBackground.length > 0
                            ? this.momentClass.custom.mosaicBackground[0]
                            : '#FFFFFF';

                        this.emptyTileColors = this.momentClass.custom.mosaicEmptyTileColor.length > 0
                            ? this.momentClass.custom.mosaicEmptyTileColor
                            : ['#1F1F1F'];

                        this.emptyTileBackgroundImage = this.momentClass.custom.mosaicEmptyTileImage.length > 0
                            ? this.momentClass.custom.mosaicEmptyTileImage
                            : null;

                        // Create an array of random indexes for some randomness
                        this.randomArray = shuffle(Array.from(Array(2 * this.momentClass.custom.mosaicGallerySize).keys()));

                        // Initialize tiles with empty array
                        this.tiles = (Array(this.momentClass.custom.mosaicGallerySize).fill(null));

                        // Resize tiles on window resize
                        window.addEventListener('resize', this.updateTileSize);

                        // Fetch images (and deleted images) once, after that on a regular basis
                        this.fetchImages();
                        window.setInterval(this.fetchImages, this.FETCH_TIMEOUT);
                        window.setInterval(this.fetchDeletedImages, this.FETCH_DELETED_TIMEOUT);
                        window.setInterval(this.rotateImages, this.FETCH_TIMEOUT);
                    });
                });
            },

            onImagesWatch: function() {

                // Get the unassigned images
                let unassigned_images = this.images.filter(image => {
                    return !this.tiles.includes(image._id);
                });

                unassigned_images = shuffle(unassigned_images);

                unassigned_images.sort((a,b) => a.viewed - b.viewed);

                // Loop through the unassigned images
                for(let i = 0; i < unassigned_images.length; i++) {
                    // Loop through the tiles, until there is an empty space
                    let tiles_keys = Array.from(this.tiles.keys());
                    tiles_keys = shuffle(tiles_keys);
                    for(let j = 0; j < tiles_keys.length; j++) {
                        if(!this.tiles[tiles_keys[j]]) {
                            this.tiles.splice(tiles_keys[j], 1, unassigned_images[i]._id);

                            // Set the viewed flag to 1
                            let index = this.images.findIndex(image => image._id === unassigned_images[i]._id);
                            this.images[index].viewed = 1;

                            break;
                        }
                    }
                }


            },

            updateTileSize: function() {
                let viewport_width = window.innerWidth;
                let viewport_height = window.innerHeight;
                let configured_tiles_count = this.momentClass ? this.momentClass.custom.mosaicGallerySize : 0;

                let cols = 0, rows, tile_size;
                do {
                    cols++;
                    tile_size = viewport_width / cols;
                    rows = Math.ceil( configured_tiles_count / cols);
                } while(rows * tile_size > viewport_height);

                // Set cols
                this.cols = cols;

                // Fill tiles array to fit cols * rows
                let optimal_tiles_count = rows * cols;
                if(optimal_tiles_count > this.tiles.length) {
                    this.tiles.push(null);
                }
                if(optimal_tiles_count < this.tiles.length) {
                    this.tiles.pop();
                }
            },

            fetchImages: function() {
                let offset = 0;
                let amount = 10;
                let contentTag = this.moment.class;

                this.asyncFetchImages(offset, amount, contentTag);

                this.onImagesWatch();
            },

            asyncFetchImages: function(offset, amount, contentTag) {
                // TODO: Use SDK method for fetching instead.
                this.getContent(offset, amount, contentTag).then((data) => {
                    // Return if there is no content left
                    if(data.length === 0) return;

                    for(let i = 0; i < data.length; i++) {
                        let element = data[i];
                        // Check if the element already exists
                        if(this.images.filter(e => e._id === element._id).length > 0) {
                            return false;
                        }
                        this.images.push({
                            ...element,
                            viewed: 0,
                        });
                    }

                    this.asyncFetchImages(offset + amount, amount, contentTag);
                });
            },

            fetchDeletedImages: function() {
                SDK.connection.getDeletedContent().then((response) => {
                    for(let i = 0; i < response.data.length; i++) {
                        let deleted_image_id = response.data[i];

                        let delete_index_images = this.images.findIndex(image => image._id === deleted_image_id);
                        if(delete_index_images > -1) {
                            this.images.splice(delete_index_images, 1);
                        }

                        let delete_index_tiles = this.tiles.findIndex(deleted_image_id);
                        if(delete_index_tiles > -1) {
                            this.tiles.splice(delete_index_tiles, 1);
                        }
                    }
                });
            },

            rotateImages: function () {
                // Only rotate when there are more images than tiles.
                if(this.images.length > this.tiles.length) {
                    // Overwrite random tile with an image which is not shown
                    let unassigned_images = this.images.filter(image => {
                        return !this.tiles.includes(image._id);
                    });
                    unassigned_images = shuffle(unassigned_images);
                    // Sort the unassigned images, in order to view those with no views first.
                    unassigned_images.sort((a,b) => a.viewed - b.viewed);

                    let image = unassigned_images[0];

                    this.tiles.splice(Math.floor(Math.random() * this.tiles.length), 1, image._id);

                    // Set the viewed flag to 1
                    let index = this.images.findIndex(image => image._id === unassigned_images[0]._id);
                    this.images[index].viewed = 1;
                }

                // Edge case: Same number of images and tiles.
                if(this.images.length === this.tiles.length) {
                    // Interchange two elements:
                    let index_1 = Math.floor(Math.random() * this.tiles.length);
                    let index_2 = Math.floor(Math.random() * this.tiles.length);
                    let item_2 = this.tiles[index_2];

                    this.tiles.splice(index_2, 1, this.tiles[index_1]);
                    this.tiles.splice(index_1, 1, item_2);
                }

                console.log(this.images.filter(image => image.viewed === 0));
            },

            // This will be replaced by an SDK API function call.
            getContent: function(offset, amount, contentTag) {
                const url = `https://${SDK.config.environment === 'production' ? '': 'staging.'}stagecast.se/api/_events/${SDK.getEventId()}/content?offset=${offset}&limit=${amount}${!contentTag ? '' : '&tag=' + contentTag}`
                return fetch(url)
                    .then(response => response.json());
            },

            getContentCdnLocation(id) {
                return SDK.connection.getContentCdnLocation(id);
            }
        }
    });
}


/**
 * Shuffles array in place.
 * @param {Array} a items An array containing the items.
 */
function shuffle(a) {
    let j, x, i;
    for (i = a.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        x = a[i];
        a[i] = a[j];
        a[j] = x;
    }
    return a;
}
