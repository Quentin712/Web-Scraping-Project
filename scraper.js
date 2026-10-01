#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

const filePath = path.join(__dirname, 'dom.html');

if (!fs.existsSync(filePath)) {
  console.error('dom.html was not found. Put it in the same folder as scraper.js.');
  process.exit(1);
}

const html = fs.readFileSync(filePath, 'utf8');
const { window } = new JSDOM(html);
const { jQueryFactory } = require('jquery/factory');
const $ = jQueryFactory(window);

const dateFormatter = new Intl.DateTimeFormat('en-GB', {
  timeZone: 'Africa/Kigali',
  day: '2-digit',
  month: '2-digit',
  year: 'numeric'
});

const items = $('li.assignment');

if (items.length === 0) {
  console.error('No assignments found. Copy the page again using Copy outerHTML.');
  process.exit(1);
}

items.each(function () {
  const item = $(this);
  const name = item.find('a.ig-title').text().trim();
  const link = item.find('a.ig-title').attr('href') || 'No link available';
  const dueAttr = item.find('.assignment-date-due time').attr('datetime');

  let dueText = 'No due date';
  let status = 'Active';

  if (dueAttr) {
    const dueDate = new Date(dueAttr);
    dueText = dateFormatter.format(dueDate);
    status = dueDate < new Date() ? 'Past due' : 'Active';
  }

  console.log('Name: ' + name);
  console.log('Due date: ' + dueText);
  console.log('Status: ' + status);
  console.log('Link: ' + link);
  console.log('');
});
