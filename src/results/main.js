document.addEventListener('DOMContentLoaded', init);
window.addEventListener('resize', update_tile_size);

/**
 * Initialize the mosaic moment results page.
 */
function init() {
    // Testing with numeric array from 0 to 99
    draw_tiles(Array.from(Array(100).keys()));
    update_tile_size();
}


/**
 * Draw the array of tiles on the screen.
 * @param {array} tiles
 */
function draw_tiles(tiles) {
    // Variables
    let tiles_container = document.getElementById('tiles-container');

    tiles.forEach(function(item, index) {
        let child_node = tiles_container.children.item(index);

        // Create a new child_node if none exists yet.
        if(!child_node) {
            child_node = document.createElement('div');
            child_node.classList.add('tile');

            // Only for testing
            child_node.style.color = '#' + Math.random().toString(16).substr(2,6);

            tiles_container.append(child_node);
        }
    });

}


/**
 * Update the size of each tile according to the viewport width and height.
 */
function update_tile_size() {
    // Variables
    let tiles_container = document.getElementById('tiles-container');
    let tiles = document.getElementsByClassName('tile');
    let tiles_count = tiles.length;

    let viewport_width = window.innerWidth;
    let viewport_height = window.innerHeight;

    // Increase the number of columns until they fit inside the viewport
    let cols = 0, rows, tile_size;
    do {
        cols++;
        tile_size = viewport_width / cols;
        rows = Math.ceil(tiles_count / cols);
    } while(rows * tile_size > viewport_height);

    let percentage_width = 100 / cols;
    for(let i = 0; i < tiles.length; i++) {
        tiles[i].style.flex = '0 0 ' + percentage_width + '%';
    }
}

