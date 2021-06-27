# [Product Analysis Website](https://yihua.website/) 

Collect and analyze Ptt discussions about beauty products to assist marketing staff to understand user
reviews of the products.

#### Website URL: [https://yihua.website/](https://yihua.website/)

#### Test Accounts:

- Account1
  - company number: 11111
  - email: test1@gmail.com
  - password: test1

- Account2
  - company number: 11112
  - email: test2@gmail.com
  - password: test2


## Table of Contents

- [Technologies](#Technologies)
- [Architecture](#Architecture)
- [Database Schema](#Database-Schema)
- [Demonstration](#Demonstration)
- [Contact](#Contact)

## Technologies

### Backend

- Node.js / Express.js
- NGINX

### Front-end

- HTML
- CSS
- JavaScript
- Bootstrap
- AJAX
- wordcloud2

### Cloud Service (AWS)

- Elastic Compute Cloud (EC2)
- Relational Database Service (RDS)

### Database

- MySQL

### Networking

- HTTP & HTTPS
- Domain Name System

### 3rd Party API

- Google Natural Language API

### Others

- Automated Web Crawler: cheerio, crontab 
- Word Cloud: nodejieba
- Design Pattern: MVC
- Version Control: Git, GitHub
- Agile: Trello

### Test

- Mocha

## Architecture

![Architecture](https://user-images.githubusercontent.com/75560708/123538166-0aa2a780-d766-11eb-8cac-911a67dd9729.JPG)


## Database Schema

![Database Design](https://user-images.githubusercontent.com/75560708/123538177-1db57780-d766-11eb-9c31-fa43aa70961e.png)

## Demonstration 

### Custom search keywords:

- Create various combinations of keywords by users. For example, users can set
brand and multiple product keywords and connect them by different conditions.

![Custom search keywords](https://user-images.githubusercontent.com/75560708/123538198-39208280-d766-11eb-8759-e35ed49b9570.jpg)

### Search for articles

- Search related Ptt articles by using custom search keywords and select from specific time, channels, and emotions.

![Search for articles](https://user-images.githubusercontent.com/75560708/123539298-9b2fb680-d76b-11eb-9379-2b47f26a4b3d.gif)


### Monitoring negative reviews and alert

- Alert users about negative reviews when they log in or add new keywords.

![negative](https://user-images.githubusercontent.com/75560708/123539186-00cf7300-d76b-11eb-8113-f90922f748a7.gif)


### Word cloud

- Display the most popular words in specific brands, products, and keywords.

![Word cloud](https://user-images.githubusercontent.com/75560708/123538253-9caab000-d766-11eb-8ad1-328ae8d42235.jpg)


### Ratio of positive and negative reviews

- Identify emotions of articles and calculate ratio of positive and negative reviews.

![PN_value](https://user-images.githubusercontent.com/75560708/123539211-20ff3200-d76b-11eb-8140-4d9a8f67474e.gif)





## Contact

<a href="https://github.com/Arielfang131" target="_blank">Ariel Fang</a>

Email: yihua0131@gmail.com
