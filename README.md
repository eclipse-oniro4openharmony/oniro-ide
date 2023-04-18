# Oniro IDE

This is a work in progress repository for the Oniro IDE project based on [Eclipse Theia](https://github.com/eclipse-theia/theia).

## Contributing

Please make sure that your system follows the [Theia development prerequisites](https://github.com/eclipse-theia/theia/blob/master/doc/Developing.md#prerequisites).

### Building

You can build both browser and electron application by running the following script:

```
yarn && yarn build
```

### Running

To start the browser application you just need to run:

```
yarn browser start
```

And similarly for the electron application:

```
yarn electron start
```

### Watching

To contiously compile the written TypeScript code, run the respective commands for your runtime:

```
yarn browser watch
```

Or

```
yarn electron watch
```

### Running in Docker container

To create the docker image `oniro-ide`:
```
docker build -t oniro-ide .
```

To start the container `oniro-ide-container`:
```
docker run -dp 3000:3000 --name oniro-ide-container oniro-ide
```

When you open the browser at `http://localhost:3000/` you will see the browser version of the IDE.
