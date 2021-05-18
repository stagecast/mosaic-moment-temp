# Mosaic Moment - Temporary repo

## Useful links
- MomentSDK: https://dev-stagecast.gitbook.io/moments-sdk/documentation/api-reference/connection

## Tentative configuration obj: 

```javascript
// you find it in /config/default.staging.json
  "custom": {
    // props for mobile
    "introTitle": "Take a selfie and appear in the collage!",
    "introDescription": "The photo collage is created with pictures of the audience.",
    "introImg": [],
    "sendButton": "Send to collage",
    "successMessage": "Nice Selfie! Your photo will appear in the collage soon.",
    "filters": [],
    "ctaEnabled": false,
    "cta": {},
    
    // props for result page
    "mosaicGallerySize": 100,
    "mosaicEmptyTileColor": [],
    "mosaicBackground": ["#FADC60"],
    "mosaicColors": ["#FADC60"],
    
    // props for both
    "theme": "light",
    "backgroundColor": "#503AF2",
  }
```

## API Calls & Info

Content tags
```javascript
// tags set by the mobile: 
[SDK.getMomentClassId(), currentMonth, 'everyone']
```

Get content info
```javascript
// (bypass CDN for caching reasons... I will provide an SDK function for this)
const url = `https://${SDK.config.environment === 'production' ? '': 'staging.'}stagecast.se/api/_events/${SDK.getEventId()}/content?offset=${offset}&limit=${amount}${contentTag == '' ? '' : '&tag=' + contentTag}`

fetch(url).then(res => console.log(res)).catch();

// returns latest ===> oldest
[
  {
    "user":"f.tester@stagecast.com",
    "type":"image/jpeg",
    "location":{"type":"Point","coordinates":[-161.023145,3.123658]},
    "created":1620921848553,
    "_id":"FDBDC2D7-7241-4E44-B1B5-4BCB9ECC1325"
  }, 
  ...
]

// example call
https://staging.stagecast.se/api/_events/F92AF0AF-348C-4BFE-8C4C-B3BBD412802D/content?offset=0&limit=100&tag=0A841CBE-1797-4A26-8341-0AEED6AFF3E0
```

Get Content CDN Location
```javascript
// the size searchParam will be supported in Stagecast 3.0
let contentUrl = SDK.getContentCdnLocation(contentId);
contentUrl += '?size=500x500'
// returns `https://d2cb7i0wbc0znj.cloudfront.net/api/content/A5AED64D-8BB2-4A85-8F63-5D711F62A367?size=500x500`
```

Get Deleted Content
```javascript
SDK.getDeletedContent().then(list => console.log(list)); 

// returns list of content ids: 
[ 
  'A5AED64D-8BB2-4A85-8F63-5D711F62A367',
  'A5AED64D-8BB2-4A85-8F63-5D711F62A367',
  ...
]
```