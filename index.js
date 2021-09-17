import express from 'express';
import bodyParser from 'body-parser';
import {createReadStream} from 'fs';
import crypto from 'crypto';
import http from 'http';
import appSrc from './app.js';
import {MongoClient} from 'mongodb';

const app = appSrc(express, bodyParser, createReadStream, crypto, http, MongoClient);
app.listen(process.env.PORT || 3000, function() {
    console.log('server running on port 3000', '');
});