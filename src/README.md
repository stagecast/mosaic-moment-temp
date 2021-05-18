# Mosaic Collage Moment

## Configuration Data
An example object:
```
{}
```

## How to Test

Follow this guide: 
https://www.freecodecamp.org/news/how-to-get-https-working-on-your-local-development-environment-in-5-minutes-7af615770eec/

Then install `http-server`

Then run inside the `/mosaic-collage` folder the command

```
http-server /Users/filippoboiani/repositories/stagecast/new-moments/mosaic-collage -S -C /Users/filippoboiani/server.crt -K /Users/filippoboiani/server.key
```

(you have to change the paths to your certificates)

Go to 
```
https://localhost:8081/src/adapters/tests/mobile.adapter.html
```