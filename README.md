# Oniro IDE

This is a work in progress repository for the Oniro IDE project based on [Eclipse Theia](https://github.com/eclipse-theia/theia).

## Contributing

Please make sure that your system follows the [Theia development prerequisites](https://github.com/eclipse-theia/theia/blob/master/doc/Developing.md#prerequisites).

### Building

You can build both browser and electron application by running the following script:

```
yarn
yarn compile
yarn download:plugins
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
