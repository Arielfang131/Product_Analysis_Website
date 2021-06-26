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

- Web Crawler: cheerio, crontab 
- Word Cloud: nodejieba
- Design Pattern: MVC
- Version Control: Git, GitHub
- Agile: Trello (Scrum)

### Test

- Mocha

## Architecture

![Architecture](https://yihuafang.s3.us-east-2.amazonaws.com/Architecture.JPG)

## Database Schema

![Database Design](https://yihuafang.s3.us-east-2.amazonaws.com/SQL+table_new.png)


## Demonstration 

### Custom search keywords:

- Create various combinations of keywords by users. For example, users can set
brand and multiple product keywords and connect them by different conditions.

<img src="https://yihuafang.s3.us-east-2.amazonaws.com/keywords.jpg">


### Search for articles

- Search related Ptt articles by using custom search keywords.

<img src="https://yihuafang.s3.us-east-2.amazonaws.com/contentlist.gif">


### Monitoring negative reviews and alert

- Alert users about negative reviews when they log in or add new keywords.

<img src="https://yihuafang.s3.us-east-2.amazonaws.com/negative.gif">


### Word cloud

- Display the most popular words of specific brands, products, and keywords.

<img src="https://yihuafang.s3.us-east-2.amazonaws.com/word+cloud.jpg">

### Ratio of positive and negative reviews

- Identify emotions of articles and calculate ratio of positive and negative reviews.

<img src="https://yihuafang.s3.us-east-2.amazonaws.com/PN_value.gif">



## Contact

<a href="https://github.com/Arielfang131" target="_blank">Ariel Fang</a>

Email: yihua0131@gmail.com