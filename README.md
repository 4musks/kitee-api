# FA22: CMPE-281 Sec 48 - Cloud Technologies Project 2

University Name: **[San Jose State University](http://www.sjsu.edu)**

Course: [Cloud Technologies](https://catalog.sjsu.edu/preview_course_nopop.php?catoid=12&coid=58375)

Professor: Sanjay Garje [Linkedin](https://www.linkedin.com/in/sanjaygarje)

## 1. Students

Nihal Kaul [Linkedin](https://www.linkedin.com/in/nihalwashere)

Utsav Rawat [Linkedin](https://www.linkedin.com/in/utsav-rawat-a519aa131)

Jaya Krishna Thupili [Linkedin](https://www.linkedin.com/in/thupili)

## 2. Project Architecture

![Architecture](screenshots/1.Architecture_3_V1.png)

## 3. Project Introduction

Kitee helps you to create forms and surveys in under 2 mins that people would like answering.

Kitee is a web application where a user can sign up and quickly start creating their first form, publish it to the world with a shareable public link and collect responses on the fly. Everything built into a single platform, Kitee acts as your control center for creating forms without writing a single line of code.

Kitee is a SaaS (Software as a Service) offering where customers can buy subscriptions and will be billed on a metered basis, for example - $19/month to publish up to 3 forms with a maximum of 100 responses each.

## 4. Prerequisites

- Cloud Provider & Services: [AWS](https://aws.amazon.com/free/)
- Version Control: [Github Developer access](github.com/)
- AWS Services
  - IAM
  - S3 Bucket
  - Certificate Manager
  - Route 53
  - CloudFront
  - CodePipeline
  - Elastic Beanstack
  - SNS
  - CloudWatch
  - SES

## 5. Local setup ad Configuration

1.  **Tools**

    - Visual Studio Code
    - Database: [MongoDB Atlas](https://www.mongodb.com/atlas/database)

      - Install and connect to mongodb local instance.

      ![mongoDB](screenshots/2.mongoDB_localhost.png)

    - Node
    - AWS Command Line Interface v2 [Download](https://awscli.amazonaws.com/AWSCLIV2.msi)
      - Configure AWS CLI

    ```bash
    $ node --version
    v16.13.2
    $ npm -version
    8.1.2
    $ aws configure
    AWS Access Key ID [None]: AKIAIOSFODNN7EXAMPLE
    AWS Secret Access Key [None]: wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
    Default region name [None]: us-west-1
    Default output format [None]: json
    ```

2.  **Setup & Configuration**

    - Git clone the repo

    ```bash
    git clone https://github.com/4musks/kitee-api.git
    cd kite-api
    ```

    - In the root directory of `kitee-api`, create a file (.env) with the following variables

    ```txt
    PORT=7000
    LOG_LEVEL=debug
    MONGO_URL=mongodb://localhost:27017/kitee
    JWT_SECRET_KEY=this-is-our-secret-key
    APP_URL=http://localhost:3000
    APP_ENV=local
    AWS_REGION=us-west-1
    AWS_ACCESS_KEY=<access-id>
    AWS_SECRET_KEY=<secret-key>
    AWS_FROM_EMAIL=Kitee <notifications@getkitee.com>
    ```

    - Install dependencies
    - Start the app

      kitee-api should connect to local/cloud MongoDB instance

    ```bash
    $ npm install
    $ npm start

    > kitee-api@1.0.0 start
    > node server.js

    info: App is now running on port 7000!!!
    info: MongoDB Connected!!!

    ```

    - Open [http://localhost:7000](http://localhost:7000) to view kitee-api status.

    ![mongoDB](screenshots/3.kitee-api-howdy.png)
