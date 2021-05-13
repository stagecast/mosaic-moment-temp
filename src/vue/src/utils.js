/**
 * Checks whether an array is itarable
 */
export function isIterableArray (array) {
  return Array.isArray(array) && !!array.length
}

/**
 * Easy way to access a deep object property, witout having to check for null or undefined
 */
export function getObjectProp (obj, path) {
  return path.reduce((accumulator, currentValue, i, array) => {
    if (typeof accumulator === 'object') {
      return accumulator[currentValue]
    }
    array.splice(1)
    return undefined
  }, obj)
}

/**
 * Add an attribute to the document element (HTML tag)
 */
export function setPageAttributes (attrs) {
  Object.keys(attrs).forEach(key => {
    document.documentElement.setAttribute(key, attrs[key])
  })
}

/**
 * Retries a Promise "attempts" times.
 */
export function retry (promise, attempts) {
  let counter = 0
  return promise.catch(err => {
    counter++
    if (counter < attempts) {
      console.warn('retry call...') //eslint-disable-line
      return retry(promise, attempts - counter)
    }
    return Promise.reject(err)
  })
}

/**
 * Custom debounce implementation, to collect subsequent user inputs and retun only the last event.
 */
export function debounce (fn, delay) {
  var timeoutId = null
  return function () {
    clearTimeout(timeoutId)
    var args = arguments
    var self = this
    timeoutId = setTimeout(function () {
      fn.apply(self, args)
    }, delay)
  }
}

export function getImagePosition (img, offsetX, offsetY) {
  var w = window.innerWidth
  var h = window.innerHeight
  var iw = img.width
  var ih = img.height
  var r = Math.min(w / iw, h / ih)
  var nw = iw * r // new prop. width
  var nh = ih * r // new prop. height
  var cx
  var cy
  var cw
  var ch
  var ar = 1

  // decide which gap to fill
  if (nw < w) ar = w / nw
  if (Math.abs(ar - 1) < 1e-14 && nh < h) ar = h / nh // updated
  nw *= ar
  nh *= ar

  // calc source rectangle
  cw = iw / (nw / w)
  ch = ih / (nh / h)

  cx = (iw - cw) * offsetX
  cy = (ih - ch) * offsetY

  // make sure source rectangle is valid
  if (cx < 0) cx = 0
  if (cy < 0) cy = 0
  if (cw > iw) cw = iw
  if (ch > ih) ch = ih

  return { cx, cy }
}
/**
 * By Ken Fyrstenberg Nilsen
 * drawImageProp(context, image [, x, y, width, height [,offsetX, offsetY]])
 * If image and context are only arguments rectangle will equal canvas
*/
export function drawImageCoverCanvas (ctx, vid, x, y, w, h, offsetX, offsetY) {
  if (arguments.length === 2) {
    x = y = 0
    w = ctx.canvas.width
    h = ctx.canvas.height
  }

  // default offset is center
  offsetX = typeof offsetX === 'number' ? offsetX : 0.5
  offsetY = typeof offsetY === 'number' ? offsetY : 0.5

  // keep bounds [0.0, 1.0]
  if (offsetX < 0) offsetX = 0
  if (offsetY < 0) offsetY = 0
  if (offsetX > 1) offsetX = 1
  if (offsetY > 1) offsetY = 1

  // var iw = vid.width
  // var ih = vid.height
  var iw = vid.videoWidth
  var ih = vid.videoHeight
  var r = Math.min(w / iw, h / ih)
  var nw = iw * r // new prop. width
  var nh = ih * r // new prop. height
  var cx
  var cy
  var cw
  var ch
  var ar = 1

  // decide which gap to fill
  if (nw < w) ar = w / nw
  if (Math.abs(ar - 1) < 1e-14 && nh < h) ar = h / nh // updated
  nw *= ar
  nh *= ar

  // calc source rectangle
  cw = iw / (nw / w)
  ch = ih / (nh / h)

  cx = (iw - cw) * offsetX
  cy = (ih - ch) * offsetY

  // make sure source rectangle is valid
  if (cx < 0) cx = 0
  if (cy < 0) cy = 0
  if (cw > iw) cw = iw
  if (ch > ih) ch = ih

  // fill image in dest. rectangle
  ctx.drawImage(vid, cx, cy, cw, ch, x, y, w, h)
}

export function dataURItoBlob (dataURI) {
  // convert base64 to raw binary data held in a string
  // doesn't handle URLEncoded DataURIs - see SO answer #6850276 for code that does this
  var byteString = atob(dataURI.split(',')[1])

  // separate out the mime component
  var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0]

  // write the bytes of the string to an ArrayBuffer
  var ab = new ArrayBuffer(byteString.length)

  // create a view into the buffer
  var ia = new Uint8Array(ab)

  // set the bytes of the buffer to the correct values
  for (var i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i)
  }

  // write the ArrayBuffer to a blob, and you're done
  var blob = new Blob([ab], { type: mimeString })
  return blob
}

export function fixImageOrientation (file, callback) {
  EXIF.getData(file, function() { //eslint-disable-line

    var can = document.createElement('canvas')
    var ctx = can.getContext('2d')
    var thisImage = new Image()
    var self = this

    thisImage.onload = function () {
      // if browser supports latest exif bug fix, do nothing, else rotate the pictures accordingly
      if ('imageOrientation' in thisImage.style) {
        can.width = thisImage.width
        can.height = thisImage.height
        ctx.save()
      } else {
        var orientation = EXIF.getTag(self, 'Orientation') // eslint-disable-line
        can.width = thisImage.width
        can.height = thisImage.height
        ctx.save()

        var width = can.width; var styleWidth = can.style.width
        var height = can.height; var styleHeight = can.style.height

        if (orientation && !('imageOrientation' in thisImage.style)) {
          // invert height and width
          if (orientation > 4 && orientation < 9) {
            can.width = height; can.style.width = styleHeight
            can.height = width; can.style.height = styleWidth
          }
          switch (orientation) {
            case 2: ctx.translate(width, 0); ctx.scale(-1, 1); break
            case 3: ctx.translate(width, height); ctx.rotate(Math.PI); break
            case 4: ctx.translate(0, height); ctx.scale(1, -1); break
            case 5: ctx.rotate(0.5 * Math.PI); ctx.scale(1, -1); break
            case 6: ctx.rotate(0.5 * Math.PI); ctx.translate(0, -height); break
            case 7: ctx.rotate(0.5 * Math.PI); ctx.translate(width, -height); ctx.scale(-1, 1); break
            case 8: ctx.rotate(-0.5 * Math.PI); ctx.translate(-width, 0); break
          }
        }
      }

      ctx.drawImage(thisImage, 0, 0)
      ctx.restore()
      const picUrl = can.toDataURL('image/jpeg')
      callback(picUrl)
    }

    thisImage.src = URL.createObjectURL(file)
  })
}

export function isMobile () {
  const a = navigator.userAgent || navigator.vendor || window.opera
  if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) { //eslint-disable-line
    return true
  }
  return false
}
