# tinify-custom

## Installation
clone the repository:
```
git clone https://github.com/h4run/tinify-custom.git
```

install npm packages:
```
cd custom-tinify
yarn install
```

## Set project settings
move your image files to the output folder in project directory.
create .env file and set tinify api key. If you dont have api key, get your api key from https://tinypng.com/developers
```
echo "TINIFY_KEY=<YOUR_API_KEY>" > .env
```
## Run
```
node index.js
```

**Note**: if you wish you can change "*input*" and "*output*" folders from index.js file.

