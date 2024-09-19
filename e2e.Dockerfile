FROM --platform=linux/amd64 node:lts

RUN mkdir /lintier

RUN mkdir /test

# 1. setup lintier

WORKDIR /lintier

COPY . .
RUN npm install
RUN npm run build

# 2. setup test vite/react/express project

WORKDIR /test

COPY ./e2eFixtures/test-repo .
RUN npm install
RUN git init

# 3. setup e2e tests

COPY ./e2eFixtures/e2e-test.ts ./src/__tests__/e2e.test.ts
COPY ./e2eFixtures/e2e.jest.config.js ./jest.config.js
COPY ./e2eFixtures/badfile.txt ./src/badfile.ts
COPY ./e2eFixtures/badcss.txt ./src/badcss.css

# 4. run lintier in test project directory, installing everything
RUN node ../lintier/bin/index.js -rnspl

# 5. run e2e tests

CMD [ "npx", "jest", "./src/__tests__/e2e.test.ts" ]
