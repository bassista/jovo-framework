

import {AlexaResponse} from "../src/core/AlexaResponse";
import _cloneDeep = require('lodash.clonedeep');
const askJSON = require('./../sample-response-json/v1/ASK.json');
const tellJSON = require('./../sample-response-json/v1/TELL.json');
const simpleCard = require('./../sample-response-json/v1/SimpleCardTell.json');
const standardCard = require('./../sample-response-json/v1/StandardCardAsk.json');


process.env.NODE_ENV = 'TEST';

test('test isTell', () => {
    const tellResponse = AlexaResponse.fromJSON(_cloneDeep(tellJSON));
    expect(tellResponse.isTell()).toBe(true);
    expect(tellResponse.isTell('Simple Tell')).toBe(true);
    expect(tellResponse.isTell(['Simple Tell', 'foo', 'bar'])).toBe(true);

    expect(tellResponse.isTell('Foo')).toBe(false);
    expect(tellResponse.isTell(['foo', 'bar'])).toBe(false);


    const askResponse = AlexaResponse.fromJSON(_cloneDeep(askJSON));
    expect(askResponse.isTell()).toBe(false);

});

test('test isAsk', () => {
    const askResponse = AlexaResponse.fromJSON(_cloneDeep(askJSON));
    expect(askResponse.isAsk()).toBe(true);
    expect(askResponse.isAsk('Simple Ask')).toBe(true);
    expect(askResponse.isAsk('Simple Ask', 'Simple Ask Reprompt')).toBe(true);

    expect(askResponse.isAsk(['Simple Ask', 'foo', 'bar'])).toBe(true);
    expect(askResponse.isAsk(['Simple Ask', 'foo', 'bar'], ['Simple Ask Reprompt', 'foo', 'bar'])).toBe(true);

    expect(askResponse.isAsk('Foo')).toBe(false);
    expect(askResponse.isAsk(['foo', 'bar'])).toBe(false);

    const tellResponse = AlexaResponse.fromJSON(_cloneDeep(tellJSON));
    expect(tellResponse.isAsk()).toBe(false);

});

test('test hasState', () => {
    const responseWithState = AlexaResponse.fromJSON(_cloneDeep(askJSON));
    responseWithState.sessionAttributes = {"_JOVO_STATE_":"test"};

    expect(responseWithState.hasState('test')).toBe(true);
    expect(responseWithState.hasState('test123')).toBe(false);
    expect(responseWithState.hasState()).toBe(true);

    const responseWithoutState = AlexaResponse.fromJSON(_cloneDeep(tellJSON));
    expect(responseWithoutState.hasState('test123')).toBe(false);
    expect(responseWithoutState.hasState()).toBe(false);
});

test('test hasSimpleCard', () => {
    const simpleCardResponse = AlexaResponse.fromJSON(_cloneDeep(simpleCard));
    expect(simpleCardResponse.hasSimpleCard()).toBe(true);

    expect(simpleCardResponse.hasSimpleCard('Simple Title')).toBe(true);
    expect(simpleCardResponse.hasSimpleCard('title')).toBe(false);

    expect(simpleCardResponse.hasSimpleCard('Simple Title', 'Simple Text')).toBe(true);
    expect(simpleCardResponse.hasSimpleCard('Simple Title', 'no')).toBe(false);

    const tellResponse = AlexaResponse.fromJSON(_cloneDeep(tellJSON));
    expect(tellResponse.hasStandardCard()).toBe(false);
});

test('test hasStandardCard', () => {
    const standardCardResponse = AlexaResponse.fromJSON(_cloneDeep(standardCard));
    expect(standardCardResponse.hasStandardCard()).toBe(true);

    expect(standardCardResponse.hasStandardCard('Standard Title')).toBe(true);
    expect(standardCardResponse.hasStandardCard('title')).toBe(false);

    expect(standardCardResponse.hasStandardCard('Standard Title', 'Standard Text')).toBe(true);
    expect(standardCardResponse.hasStandardCard('Standard Title', 'no')).toBe(false);

    expect(standardCardResponse.hasStandardCard(
        'Standard Title',
        'Standard Text',
        'https://via.placeholder.com/720x480'
    )).toBe(true);
    expect(standardCardResponse.hasStandardCard(
        'Standard Title',
        'Standard Text',
        'https://via.placeholder.com/'
    )).toBe(false);

    expect(standardCardResponse.hasStandardCard(
        'Standard Title',
        'Standard Text',
        'https://via.placeholder.com/720x480',
        'https://via.placeholder.com/1200x800'
    )).toBe(true);
    expect(standardCardResponse.hasStandardCard(
        'Standard Title',
        'Standard Text',
        'https://via.placeholder.com/',
        'https://via.placeholder.com/'
    )).toBe(false);

    const askResponse = AlexaResponse.fromJSON(_cloneDeep(askJSON));
    expect(askResponse.hasStandardCard()).toBe(false);

});
