const express = require('express');
const Seeds = require('../models/seeds');

import {authenticatedUserHasRole, getAuthenticatedTwitchUserId} from '../utils/SecurityHelper';

let router = express.Router();

router.route("/")
    .get(async (request, response) => {
        try {
            let seeds = await Seeds.find({}, null).exec();

            return response.json(seeds);
        } catch (error) {
            console.error(error);
            response.status(500);
            return response.send(error);
        }
    })
    .post(async (request, response) => {
        let twitchUser = getAuthenticatedTwitchUserId(request);
        if (authenticatedUserHasRole(request, "ANONYMOUS_USER")) {
            response.status(403);
            return response.send("Insufficient privileges");
        }

        try {
            // Save body
            request.body.ownerId = twitchUser;
            let seed = await Seeds.create(request.body);
            return response.json(seed);
        } catch (error) {
            console.error(error);
            response.status(500);
            return response.send(error);
        }
    })

router.route("/:id")
    .get(async (request, response) => {
        try {
            let seed = await Seeds.findById(request.params.id);
            return response.json(seed);
        } catch (error) {
            console.error(error);
            response.status(500);
            return response.send(error);
        }
    })
    .put(async (request, response) => {
        let twitchUser = getAuthenticatedTwitchUserId(request);

        let seed = await Seeds.findById(request.params.id);
        if (twitchUser !== seed.ownerId && !authenticatedUserHasRole(request, "GLOBAL_ADMIN")) {
            response.status(403);
            return response.send("Insufficient privileges");
        }

        try {
            let updated = await Seeds.findByIdAndUpdate(request.params.id, request.body);
            return response.json(request.body);
        } catch (error) {
            console.error(error);
            response.status(500);
            return response.send(error);
        }
    })
    .delete(async (request, response) => {
        let twitchUser = getAuthenticatedTwitchUserId(request);
        
        let seed = await Seeds.findById(request.params.id);
        if (twitchUser !== seed.ownerId && !authenticatedUserHasRole(request, "GLOBAL_ADMIN")) {
            response.status(403);
            return response.send("Insufficient privileges");
        }

        try {
            await Seeds.findByIdAndDelete(request.params.id);
            return response.send();
        } catch (error) {
            console.error(error);
            response.status(500);
            return response.send(error);
        }
    })

module.exports = router;