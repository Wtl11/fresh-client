---
to: "src/pages/<%= h.inflection.dasherize(package) %>/<%= h.inflection.dasherize(name) %>/config.js"
---
import Vue from 'vue'
import Page from './<%=  h.inflection.dasherize(name) %>'

const page = new Vue(Page)
page.$mount()
