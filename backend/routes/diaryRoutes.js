import express from 'express';
import {Page} from '../models/page.js';

const router = express.Router();

const parseQueryString = (queryString) => {
    const params = queryString.split(';').reduce((acc, param) => {
        const [key, value] = param.split('=');
        if (key && value) {
            acc[key.trim()] = value.trim();
        }
        return acc;
    }, {});
    return params;
};

const buildQueryObject = (params) => {
    const queryObject = {};
    if (params.title) {
        const regexValue = params.title.replace('*', '.*');
        queryObject.title = { $regex: regexValue, $options: 'i' };
    }
    // if (params.content) {
    //     queryObject.content = { $regex: params.content, $options: 'i' };
    // }
    if (params.author) {
        queryObject.author = { $regex: params.author, $options: 'i' };
    }
    if (params.mood) {
        queryObject.mood = params.mood;
    }
    if (params.dateStart && params.dateEnd) {
        const startDate = new Date(params.dateStart);
        const endDate = new Date(params.dateEnd);
        queryObject.date = {
            $gte: startDate,
            $lte: endDate
        };
    } else if (params.dateStart) {
        const startDate = new Date(params.dateStart);
        queryObject.date = { $gte: startDate };
    } else if (params.dateEnd) {
        const endDate = new Date(params.dateEnd);
        queryObject.date = { $lte: endDate };
    }
    return queryObject;
};

router.post('/', async (request,response) => {
    try{
        const newPage = {
            title : request.body.title,
            author : request.body.author,
            content : request.body.content,
            date: request.body.date,
            mood: request.body.mood,
        };
        const page = await Page.create(newPage);
        return response.status(200).send(page);
    } catch(err) {
        console.error(err.message);
        response.status(500).send({message:err.message});
    }
});
router.get('/', async (request,response) => {
    try{
        const {title,date,author} = request.query;
        let query = {};
        if(title) {
            query.title = { $regex: title, $options: 'i' };
        }
        if(author) {
            query.author = author;
        }
        if(date) {
            query.date = date;
        }
        const projection = { content: 0 };
        const pages = await Page.find(query, projection);
        return response.status(200).json({
            count: pages.length,
            data: pages,
        });
    }catch(err) {
        console.error(err);
        response.status(500).send({message:err.message});
    }
});

router.get('/search', async (request,response) => {
    try{
        const queryString = request.query.queryString;
        const params = parseQueryString(queryString);
        const queryObject = buildQueryObject(params);
        const projection = { content: 0 };
        const pages = await Page.find(queryObject, projection);
        return response.status(200).json({ count: pages.length, data: pages,});
    }catch(err) {
        console.error(err);
        response.status(500).send({message:err.message});
    }
});

router.get('/:id', async (request,response) => {
    try{
        const {id} = request.params;
        const page = await Page.findById(id);
        if (!page) return response.status(404).json({ message: "Page not found" });
        return response.status(200).json(page);
    }catch(err) {
        console.error(err);
        response.status(500).send({message:err.message});
    }
});
router.put('/:id', async (request,response) => {
    try{
        const {id} = request.params;
        const res = await Page.findByIdAndUpdate(id,request.body);
        if(!res) return response.status(404).json({message: "Page not found"});
        return response.status(200).json({message: "Page updated successfully"});
    }catch(err) {
        console.error(err);
        response.status(500).send({message:err.message}, page);
    }
});
router.delete('/:id', async (request,response) => {
    try{
        const {id} = request.params;
        const res = await Page.findByIdAndDelete(id);
        if(!res) return response.status(404).json({message: "Page not found"});
        return response.status(200).json({message: "Page deleted successfully"});
    } catch(err) {
        console.error(err);
        return response.status(500).send({message: err.message});
    }
});

export default router;