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

const useColor = !process.env.NO_COLOR && (process.stdout.isTTY || process.env.FORCE_COLOR);

const colors = {
  red: '\x1b[31m',
  green: '\x1b[32m',
  gray: '\x1b[90m',
  reset: '\x1b[0m'
};

function paint(color, text) {
  return useColor ? color + text + colors.reset : text;
}

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
  let color = colors.gray;

  if (dueAttr) {
    const dueDate = new Date(dueAttr);
    dueText = dateFormatter.format(dueDate);
    const isPast = dueDate < new Date();
    status = isPast ? 'Past due' : 'Active';
    color = isPast ? colors.red : colors.green;
  }

  console.log(paint(color, 'Name: ' + name));
  console.log(paint(color, 'Due date: ' + dueText));
  console.log(paint(color, 'Status: ' + status));
  console.log(paint(color, 'Link: ' + link));
  console.log('');
});
