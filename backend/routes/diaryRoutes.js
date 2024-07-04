import express from 'express';
import {Page} from '../models/page.js';

const router = express.Router();

router.post('/', async (request,response) => {
    try{
        const newPage = {
            title : request.body.title,
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
        const pages = await Page.find({});
        return response.status(200).json({
            count: pages.length,
            data: pages,
        });
    }catch(err) {
        console.error(err);
        response.status(500).send({message:err.message});
    }
});

router.get('/:id', async (request,response) => {
    try{
        const {id} = request.params;
        const page = await Page.findById(id);
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
        if(!res) return response.status(400).json({message: "Page not found"});
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
        if(!res) return response.status(400).json({message: "Page not found"});
        return response.status(200).json({message: "Page deleted successfully"});
    } catch(err) {
        console.error(err);
        return response.status(500).send({message: err.message});
    }
});

export default router;