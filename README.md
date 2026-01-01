# todos
Simple todo list based on Svelte framework.

It provides the Front-End and the REST-API Back-End which uses SQLite as DB.

## Front-End

![](_todos.png)

I have developed it to learn Svelte and I am using it for my day to day work.

This relase uses an express.js REST API backend.


# run it

First install the dependencies...

```bash
cd todos/front-end
npm install
```

the run it

```bash
npm run dev
```

Now you can navigate to [localhost:5000](http://localhost:5000). You should see your app running in your browser.

 
 ## Back-End

First install the dependencies...

```bash
cd todos/back-end
npm install
```

the run it

```bash
node index.js
```

```
START TODOS BACK-END SERVER
sqlite:todos.sql3
init model
ToDos Back-End is running on 4000
Executing (default): CREATE TABLE IF NOT EXISTS `todos` (`id` INTEGER PRIMARY KEY AUTOINCREMENT, `stato` VARCHAR(255), `task` VARCHAR(255), `owner` VARCHAR(255), `scadenza` VARCHAR(255), `prio` VARCHAR(255), `createdAt` DATETIME NOT NULL, `updatedAt` DATETIME NOT NULL);
Executing (default): PRAGMA INDEX_LIST(`todos`)
```
x
xx
