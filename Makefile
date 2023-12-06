# if building with docker, change this to docker.
CONENG := dzdo docker
IMG_NAME := secondapp
LEN := 0

ifeq ($(shell test -d .git; echo $$?), 0)
  ifeq ($(origin CI_COMMIT_SHA), undefined)
    CI_COMMIT_SHA := $(shell git describe --all --dirty --long)
  endif

  LVER := $(shell git describe --tags)
  SVER := $(shell git describe --tags | rev | cut -c 10- | rev)

  ifeq ($(shell test -z $(LVER); echo $$?), 1)
    LEN := $(shell expr length $(LVER))
  endif

  ifeq ($(shell test $(LEN) -gt 10; echo $$?), 0)
 	  VER := $(SVER)
  else
	  VER := $(LVER)
  endif
endif

install:
	npm install

lint:
	ng lint

build: install
	npm run build --prod

oci:
	$(CONENG) build -f Dockerfile --build-arg VER=$(VER) --tag $(IMG_NAME):$(VER) --tag localhost/$(IMG_NAME):$(VER) --no-cache .

test:
	ng test --no-watch --browsers=Headless