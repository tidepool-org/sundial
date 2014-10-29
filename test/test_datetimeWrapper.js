// == BSD2 LICENSE ==
// Copyright (c) 2014, Tidepool Project
//
// This program is free software; you can redistribute it and/or modify it under
// the terms of the associated License, which is identical to the BSD 2-Clause
// License as published by the Open Source Initiative at opensource.org.
//
// This program is distributed in the hope that it will be useful, but WITHOUT
// ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
// FOR A PARTICULAR PURPOSE. See the License for more details.
//
// You should have received a copy of the License along with this program; if
// not, you can obtain one from Tidepool Project at tidepool.org.
// == BSD2 LICENSE ==

'use strict';

var salinity = require('salinity');
var expect = salinity.expect;
var testMoment = require('moment');

describe('Tidepool Dates', function() {

  describe('wrapper',function(){
    var datetimeWrapper;

    beforeEach(function () {
      datetimeWrapper = require('../sundial');
    });

    it('should not break require',function(done){
      expect(datetimeWrapper).exists;
      done();
    });
    it('should have utcString method',function(done){
      expect(datetimeWrapper.utcDateString()).exists;
      done();
    });
    it('should have getOffsetFromTime method',function(done){
      expect(datetimeWrapper.getOffsetFromTime()).exists;
      done();
    });
    it('should have getOffsetFromTime method',function(done){
      expect(datetimeWrapper.getOffsetFromTime()).exists;
      done();
    });
    it('should have getOffset method',function(done){
      expect(datetimeWrapper.getOffset()).exists;
      done();
    });

    it('should have formatForDisplay method',function(done){
      expect(datetimeWrapper.formatForDisplay()).exists;
      done();
    });

    describe('momentInstance', function() {
      it('returns a valid instance of moment',function(done){

        var givenMoment = datetimeWrapper.momentInstance();

        expect(testMoment.isMoment(givenMoment())).to.be.true;

        done();
      });
    });
    describe('getUtcString', function() {
      /*
       * http://en.wikipedia.org/wiki/Iso8601#Time_offsets_from_UTC
       */
      it('returns a string',function(done){

        var utcString = datetimeWrapper.utcDateString();
        expect(utcString).is.a.String;
        done();
      });

      it('returns a valid date',function(done){

        var utcString = datetimeWrapper.utcDateString();
        expect(testMoment(utcString).isValid()).is.true;

        done();
      });
      it('has the offset from UTC',function(done){

        var utcString = datetimeWrapper.utcDateString();

        var zoneOfTestRun = testMoment().zone();
        var offsetFromTimestap = testMoment.parseZone(utcString).zone();
        //may be zero as some of the test run services are configured as if they are in UTC
        expect(offsetFromTimestap).to.equal(zoneOfTestRun);

        done();
      });
      it('does not contain the `Z` designator for the zero UTC offset',function(done){

        var utcString = datetimeWrapper.utcDateString();

        expect(utcString).to.not.contain('Z');
        expect(utcString).to.not.contain('z');

        done();
      });
    });
    describe('getOffset', function() {
      it('retuns an offset from utc in minutes',function(done){

        var offset = datetimeWrapper.getOffset();
        var usersZone = testMoment().zone();
        expect(offset).to.equal(usersZone);
        done();
      });
    });
    describe('getOffsetFromTime', function() {
      it('retuns an offset from utc in minutes',function(done){

        var timestamp = '2013-01-01T00:00:00-13:00';

        var offset = datetimeWrapper.getOffsetFromTime(timestamp);
        expect(offset).to.equal(780);
        done();
      });
    });
    describe('formatForDisplay', function() {
      var isoDateString = '2013-05-09T00:00:00-00:00';
      // formatForDisplay gives a display string in the browser's local timezone
      // so to test we need to create such a string and check
      // that results of formatting a local timezone-naive string
      // are identical to results of formatting an ISO string in the local browser/env
      var localString = testMoment(isoDateString).format('YYYY-MM-DDTHH:mm:ss');
      // get the browser and/or test env's local offset
      var offset = new Date().getTimezoneOffset();
      it('returns a string formated as MMMM D [at] h:mm a',function(done){
        // we expect the isoDateString and the localString to be different
        // except when the env is UTC (i.e., offset 0)
        if (offset !== 0) {
          expect(isoDateString.replace('-00:00', '')).not.to.equal(localString);
        }

        var formattedIsoString = datetimeWrapper.formatForDisplay(isoDateString);
        var formattedLocalString = datetimeWrapper.formatForDisplay(localString);
        expect(formattedIsoString).to.equal(formattedLocalString);
        done();
      });

      it('returns a string formatted to the mask specified',function(done){
        var mask = 'YYYY/MM/DD HH:mm';

        var formattedIsoString = datetimeWrapper.formatForDisplay(isoDateString, mask);
        var formattedLocalString = datetimeWrapper.formatForDisplay(localString, mask);
        expect(formattedIsoString).to.equal(formattedLocalString);
        done();
      });

    });
    describe('formatForStorage', function() {
      var basicTimestamp = '2014-10-03T13:23';
      var offsetMins = 780;

      it('returns a string',function(done){

        var utcString = datetimeWrapper.formatForStorage(basicTimestamp,offsetMins);
        expect(utcString).is.a.String;
        done();
      });

      it('returns a valid date',function(done){

        var utcString = datetimeWrapper.formatForStorage(basicTimestamp,offsetMins);
        expect(testMoment(utcString).isValid()).is.true;

        done();
      });
      it('has the offset from UTC',function(done){

        var utcString = datetimeWrapper.formatForStorage(basicTimestamp,offsetMins);
        var offsetFromTimestap = testMoment.parseZone(utcString).zone();
        expect(offsetFromTimestap).to.equal(offsetMins);

        done();
      });
      it('does not contain the `Z` designator for the zero UTC offset',function(done){

        var utcString = datetimeWrapper.utcDateString();

        expect(utcString).to.not.contain('Z');
        expect(utcString).to.not.contain('z');

        done();
      });
    });
    describe('isValidDate', function() {

      it('returns false for null',function(done){
        expect(datetimeWrapper.isValidDate(null)).is.false;
        done();
      });
      it('returns false for empty string',function(done){
        expect(datetimeWrapper.isValidDate('')).is.false;
        done();
      });
      it('returns false for invalid date',function(done){
        expect(datetimeWrapper.isValidDate('Junk')).is.false;
        done();
      });
      it('returns true for a valid date',function(done){
        expect(datetimeWrapper.isValidDate(new Date().toISOString())).is.true;
        done();
      });
    });

    describe('timeAgo', function() {

      it('returns the time ago for the given period',function(done){
        var now =  testMoment();
        var twoMonthsAgo = now.subtract(2, 'months');
        expect(datetimeWrapper.timeAgo(twoMonthsAgo.format(),'months')).equals(2);
        done();
      });
      it('returns nothing if the period is not given',function(done){
        var now =  testMoment();
        var twoMonthsAgo = now.subtract(2, 'months');
        expect(datetimeWrapper.timeAgo(twoMonthsAgo.format())).to.be.null;
        done();
      });
    });

    describe('getTimezones', function() {

      it('returns all timezone objects',function(done){
        expect(datetimeWrapper.getTimezones()).to.have.length(131);
        done();
      });

      it('returns timezone objects with correct properties',function(done){
        datetimeWrapper.getTimezones().forEach(function(timezone){
          expect(timezone.name).to.have.length.above(0);
          expect(timezone.label).to.have.length.above(0);
        });
        done();
      });
    });

    describe('getDeviceTimezone', function() {

      it('returns a valid timezone object',function(done){
        var timezone = datetimeWrapper.getDeviceTimezone();
        expect(timezone.name).to.have.length.above(0);
        expect(timezone.label).to.have.length.above(0);
        done();
      });
    });

  });
});
