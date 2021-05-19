if(window.Stagecast) {
    const SDK = new Stagecast();

    /**
     * The Mosaic Vue component.
     */
    const app = new Vue({
        el: '#mosaic',
        data: {
            tiles: [],
            moment: undefined,
            cols: 0,
            logoOverlay: undefined,
            colorOverlay: undefined,
        },
        computed: {
            emptyTileColors: function() {
                let colors = ['#1F1F1F'];
                if (this.moment && this.moment.custom.mosaicEmptyTileColor.length > 0) {
                    colors = this.moment.custom.mosaicEmptyTileColor;
                }
                return colors;
            },
        },
        watch: {
            tiles: function(newTiles, oldTiles) {
                this.updateTileSize();
            }
        },
        created() {
            this.init();
        },
        methods: {
            init: function() {
                // Receive the config and get the moment class
                SDK.onConfigReceived(() => {
                    SDK.connection.getMomentClass().then((data) => {
                        this.moment = data;

                        // TODO: Use configuration
                        this.logoOverlay = 'https://purepng.com/public/uploads/large/purepng.com-nike-logologobrand-logoiconslogos-251519940082eoxxs.png';

                        this.colorOverlay = this.moment.custom.mosaicBackground.length > 0 ? this.moment.custom.mosaicBackground[0] : '#FFFFFF';

                        // Initialize tiles with empty array
                        this.tiles = (Array(this.moment.custom.mosaicGallerySize).fill(null));

                        // Resize tiles on window resize
                        window.addEventListener('resize', this.updateTileSize);
                    });
                });
            },
            updateTileSize: function() {
                let viewport_width = window.innerWidth;
                let viewport_height = window.innerHeight;
                let configured_tiles_count = this.moment ? this.moment.custom.mosaicGallerySize : 0;

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
            }
        }
    });
}
