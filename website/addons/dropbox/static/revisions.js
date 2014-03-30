/**
 * Simple knockout model and view model for rendering the revision table on the
 * file detail page.
 */
;(function (global, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['knockout', 'jquery', 'osfutils'], factory);
    } else {
        global.RevisionTable  = factory(ko, jQuery);
    }
}(this, function(ko, $) {
    'use strict';

    function Revision(data) {
        this.rev = data.rev;
        this.modified = new FormattableDate(data.modified);
        this.download = data.download;
        this.view = data.view;
    }
    function RevisionViewModel(url) {
        var self = this;
        self.revisions = ko.observableArray([]);
        $.ajax({
            url: url, type: 'GET', dataType: 'json',
            // On success, update the revisions observable
            success: function(response) {
                self.revisions(ko.utils.arrayMap(response.result, function(rev) {
                    return new Revision(rev);
                }));
            }
        });
    }
    // Public API
    function RevisionTable(selector, url) {
        $.osf.applyBindings(new RevisionViewModel(url), selector);
    }

    return RevisionTable;
}));
