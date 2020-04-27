var blacklist = {
    urls: [],
    tabIds: []
};
var redirectionUrl = chrome.extension.getURL('html/blocked.html');
var isBlockedUrl = function (url) {
    return blacklist.urls.find(function (blockedUrl) { return urlToRegex(blockedUrl).test(url); });
};
var isBlockedTabId = function (id) {
    return blacklist.tabIds.includes(id);
};
var clearTabId = function (id) {
    blacklist.tabIds.splice(blacklist.tabIds.indexOf(id), 1);
};
var urlToRegex = function (url) {
    return RegExp(url.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
};
var onTabUpdate = function (tabId, changeInfo, tab) {
    if (isBlockedUrl(tab.url) && !isBlockedTabId(tabId)) {
        blacklist.tabIds.push(tabId);
        chrome.tabs.update(tabId, { url: redirectionUrl });
    }
    else {
        clearTabId(tabId);
    }
};
var onStorageChange = function (changes, namespace) {
    for (var key in changes) {
        var _a = changes[key], newValue = _a.newValue, oldValue = _a.oldValue;
        blacklist.urls = (Array.isArray(newValue) && newValue.length > 0)
            ? newValue
            : [];
    }
    console.log("new blacklist set: ", blacklist.urls);
};
chrome.storage.sync.set({ savedUrlBlacklist: ['reddit.com/r/pathofexile', 'reddit.com/r/aww'] });
chrome.storage.sync.get(['savedUrlBlacklist'], function (_a) {
    var savedUrlBlacklist = _a.savedUrlBlacklist;
    blacklist.urls = savedUrlBlacklist;
    console.log("blacklist read from storage: ", blacklist.urls);
});
chrome.storage.onChanged.addListener(onStorageChange);
chrome.tabs.onUpdated.addListener(onTabUpdate);
