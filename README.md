# SecondApp
Builds in container
```
dzdo docker run -d -it -p 80:80/tcp --name second-app secondapp:latest
```
Can forward ports in vscode

## TODO
- make submitting hero show up in heroes list right away
- have so errors popup in a toast
- picture upload for new hero and hero detail
- tests

## Tests todo
- services
  + hero.service 
  + message.service
  + in memory data service
- components
  + hero detail
  + hero form
  + hero search  
  + heroes
  + messages
- routing?
- app module?