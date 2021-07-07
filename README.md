# CodeScape

## User stories
CodeScape is an app designed for programmers to enable them to create, organize, and archive code snippets.

## Models
#### Snippet model
```
  content: {
    type: String,
    required: true,
  },
  language: {
    type: String,
  },
  owner: {
    ref: 'User',
    type: mongoose.Schema.Types.ObjectId
  }
```

#### User model

```
  username: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  }
```

## Routes

GET /

GET /login

GET /signup

POST /login

POST /signup



## Backlog
- Possibility to follow other users and see their snippets;
- Resources page;


## Links
[Trello](https://trello.com/b/gTyFyNr4/codescape)


### Git

[Repository Link](https://github.com/Kalande/CodeScape)

[Deploy Link]

### Slides

[Slides Link](https://docs.google.com/presentation/d/1c3jc7EyW_yYRE_Tm-s-mhmGKUYmDysP5x9hr41UBlAU/edit?usp=sharing)