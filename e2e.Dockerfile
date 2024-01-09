FROM --platform=linux/amd64 node:lts

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

# 3. setup e2e tests

RUN npm install -D jest ts-jest @types/node @types/jest execa@4.1.0

COPY ./e2eFixtures/e2e-test.ts ./src/__tests__/e2e.test.ts
COPY ./e2eFixtures/e2e.jest.config.js ./jest.config.js
COPY ./e2eFixtures/badfile.txt ./src/badfile.ts
COPY ./e2eFixtures/badcss.txt ./src/badcss.css

# 4. run lintier in test project directory, installing everything

RUN node ../../lintier/bin/index.js -rnascpl

# 5. run e2e tests

CMD [ "npx", "jest", "./src/__tests__/e2e.test.ts" ]
