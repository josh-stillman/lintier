FROM node:14

# SHELL ["/bin/bash", "-c"]

RUN mkdir /lintier

RUN mkdir /test

# 1. setup lintier

WORKDIR /lintier

COPY . .
RUN npm install
RUN npm run build

# 2. setup create-snowpack-app test project

WORKDIR /test

# RUN npx create-react-app cra-app --template typescript
RUN npx create-snowpack-app test-app --template @snowpack/app-template-react-typescript

WORKDIR /test/test-app

RUN npm install -D jest ts-jest @types/node @types/jest

# TODO: copy in test fixtures (bad files to test)
# TODO: change dir to e2e fixtures
COPY ./src/__tests__/e2e.test.ts ./src/__tests__/e2e.test.ts
COPY ./e2eFixtures/e2e.jest.config.js ./jest.config.js

# 3. run lintier in test project directory

RUN node ../../lintier/bin/index.js -r

# 4. run e2e tests

CMD [ "npx", "jest", "./src/__tests__/e2e.test.ts" ]
