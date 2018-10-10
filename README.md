# thaipost

Unoffical Node REST APIs for Thailand Post

## TOC

1. [APIs](#apis)
2. [Server](#server)
3. [CLI](#cli)

### APIs

I create the api code for fetch and generate the json result from html using headless chrome. It might take time more than usually

The APIs are under the [lib](/src/lib/apis.ts) folder. that is a `async` method.

### Server

Express + APIs = the RESTAPI server for developer who want to create awesome project about the redesign Thailand Post.

The Server are under the [server](/src/server/index.ts) folder

#### Usage

The server will run on port **8080** at path `<url>:8080/tracking/<id>`. Available parameters

| Parameter   | Description               |
| ----------- | ------------------------- |
| format=true | add indent to json object |

### CLI

**In order to run CLI, node 8^ is required**

For CLI, I use [ocif](https://github.com/oclif) and APIs to create cli for thaipost.

#### Usage

```bash
$ thaiport [TRACKID]
$ thaiport [TRACKID] --json|-J # for output as json

$ thaiport --version|--help # for helper
```
