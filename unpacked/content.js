// Report Table
var reportElement = document.createElement('div');
var reportFailedElement = document.createElement('div');

// Resource Collector AppState
var appState = {
    // Downloading Flag
    _isDownloading: false,
    get isDownloading() {
        console.log('[Resource Collector] : ', 'get isDownloading', 'isDownloading', appState._isDownloading);
        return appState._isDownloading;
    },
    set isDownloading(isDownloading) {
        console.log('[Resource Collector] : ', 'set isDownloading', 'appState._isDownloading', appState._isDownloading, 'isDownloading', isDownloading);
        appState._isDownloading = isDownloading;
    },

    _isDownloaded: false,
    get isDownloaded() {
        console.log('[Resource Collector] : ', 'get isDownloaded', 'isDownloaded', appState._isDownloaded);
        return appState._isDownloaded;
    },
    set isDownloaded(isDownloaded) {
        console.log('[Resource Collector] : ', 'set isDownloaded', 'appState._isDownloaded', appState._isDownloaded, 'isDownloaded', isDownloaded);
        appState._isDownloaded = isDownloaded;
    },

    _isWaitingForReload: false,
    get isWaitingForReload() {
        console.log('[Resource Collector] : ', 'get isWaitingForReload', 'isWaitingForReload', appState._isWaitingForReload);
        return appState._isWaitingForReload;
    },
    set isWaitingForReload(isWaitingForReload) {
        console.log('[Resource Collector] : ', 'set isWaitingForReload', 'appState._isWaitingForReload', appState._isWaitingForReload, 'isWaitingForReload', isWaitingForReload);
        appState._isWaitingForReload = isWaitingForReload;
    },

    _reqs: {},
    get reqs() {
        console.log('[Resource Collector] : ', 'get reqs', 'reqs', appState._reqs);
        return appState._reqs;
    },
    set reqs(reqs) {
        console.log('[Resource Collector] : ', 'set reqs', 'appState._reqs', appState._reqs, 'reqs', reqs);
        appState._reqs = reqs;
    }
    
};

// Reset Resource Collector
const resetResourceCollector = () => {
    console.log('[Resource Collector] : ', 'resetResourceCollector');

    appState.isDownloading = false;
    appState.isDownloaded = false;
    appState.reqs = {};
};

class SiteInfo {
    // url = '';
    // isDownloading = false;
    // isDownloaded = false;
    // isFailed = false;
    constructor(url) {
        this.url = url;
        this.isDownloading = false;
        this.isDownloaded = false;
        this.isFailed = false;
    }
    // setData(isDownloading, isDownloaded, isFailed) {
    //     // this.url = _url;
    //     this.isDownloading = isDownloading;
    //     this.isDownloaded = isDownloaded;
    //     this.isFailed = isFailed;
    // }

    get url() {
        console.log('[Resource Collector] : ', 'get ', 'url', 'this.url', this.url);
        return this.url;
    }
    set url(url) {
        console.log('[Resource Collector] : ', 'set ', 'url', 'this.url', this.url, 'url', url);
        this.url = url;
    }

    get isDownloading() {
        console.log('[Resource Collector] : ', 'get ', 'isDownloading', 'this.isDownloading', this.isDownloading);
        return this.isDownloading;
    }
    set isDownloading(isDownloading) {
        console.log('[Resource Collector] : ', 'set ', 'isDownloading', 'this.isDownloading', this.isDownloading, 'isDownloading', isDownloading);
        this.isDownloading = isDownloading;
    }

    get isDownloaded() {
        console.log('[Resource Collector] : ', 'get ', 'isDownloaded', 'this.isDownloaded', this.isDownloaded);
        return this.isDownloaded;
    }
    set isDownloaded(isDownloaded) {
        console.log('[Resource Collector] : ', 'set ', 'isDownloaded', 'this.isDownloaded', this.isDownloaded, 'isDownloaded', isDownloaded);
        this.isDownloaded = isDownloaded;
    }

    get isFailed() {
        console.log('[Resource Collector] : ', 'get ', 'isFailed', 'this.isFailed', this.isFailed);
        return this.isFailed;
    }
    set isFailed(isFailed) {
        console.log('[Resource Collector] : ', 'set ', 'isFailed', 'this.isFailed', this.isFailed, 'isFailed', isFailed);
        this.isFailed = isFailed;
    }
}

// List download sites state
var downloadSites = {
    sites: [
        // {
        //     url: "https://google.com.au",
        //     isDownloading: false,
        //     isDownloaded: false,
        //     isFailed: false,
        // },
    ],
    get listHtml() {
        return this.sites.map((site) => {
            return `<li class="list-item ${site.isDownloading ? 'is-downloading' : ''} ${site.isDownloaded ? 'is-downloaded' : ''} ${site.isFailed ? 'is-failed' : ''}">
                <div class="list-url">${site.url}</div>
            </li>`;
        }).join(``);
    }
};

const resetListSites = () => {
    console.log('[Resource Collector] : ', 'resetListSites');

    downloadSites.sites = downloadSites.sites.map((item) => {
        return new SiteInfo(item);
        // return Object.assign({}, item, {
        //     isDownloading: false,
        //     isDownloaded: false,
        //     isFailed: false,
        // });
    });
};

const updateListSites = (idx, item) => {
    console.log('[Resource Collector] : ', 'updateListSites', 'idx', idx, 'item', item);
    downloadSites.sites[idx] = item;
    document.getElementById('list-sites').innerHTML = downloadSites.listHtml;
};

// Refresh Button
document.getElementById('refresh').addEventListener('click', () => {
    console.log('[Resource Collector] : ', 'refresh', 'click');

    // Reset Resource Collector
    resetResourceCollector();
    window.location.reload(true);
});

// Document Ready
document.addEventListener('DOMContentLoaded', () => {
    console.log('[Resource Collector] : ', 'DOMContentLoaded');
    //	chrome.devtools.network.getHAR((logInfo) =>{
    //			console.log(logInfo);
    //		});
    //  appState.reqs = []
    chrome.devtools.network.onRequestFinished.addListener((req) => {
        console.log('[Resource Collector] : ', 'chrome.devtools.network.onRequestFinished', 'req', req);
        // Only collect Resource when XHR option is enabled
        if (document.getElementById('check-xhr').checked) {
            console.log('[Resource Collector] : ', 'added', 'req.request.url', req.request.url);
            req.getContent((body, encoding) => {
                console.log('[Resource Collector] : ', 'req.getContent', 'body', body, 'encoding', encoding);
                if (!body) {
                    console.log('[Resource Collector] : ', 'No Content Detected!  Will ignore:', 'req.request.url', req.request.url);
                } else {
                    appState.reqs[req.request.url] = {
                        body,
                        encoding
                    };
                }
                setResourceCount();
            });
            setResourceCount();
        }
    });

    var setResourceCount = debounce(() => {
        if (document.getElementById('check-xhr').checked) {
            chrome.devtools.network.getHAR((logInfo) => {
                console.log('[Resource Collector] : ', 'chrome.devtools.network.getHAR', 'logInfo', logInfo);
                if (!appState.isDownloading) {
                    document.getElementById('status').innerHTML = 'Requests: ' + logInfo.entries.length;
                }
                chrome.devtools.inspectedWindow.getResources((resources) => {
                    console.log('[Resource Collector] : ', 'chrome.devtools.inspectedWindow.getResources', 'resources', resources);
                    if (!appState.isDownloading) {
                        document.getElementById('status').innerHTML += ' | Static Resources: ' + resources.length;
                    }
                });
            });
        } else {
            chrome.devtools.inspectedWindow.getResources((resources) => {
                console.log('[Resource Collector] : ', 'chrome.devtools.inspectedWindow.getResources', 'resources', resources);
                if (!appState.isDownloading) {
                    document.getElementById('status').innerHTML = 'Static Resources count: ' + resources.length;
                }
            });
        }
    }, 150);


    document.getElementById('up-save').addEventListener('click', saveAllResourcesFromList);
    document.getElementById('reset').addEventListener('click', resetResourceCollector);

    document.getElementById('edit-list').addEventListener('click', () => {
        console.log('[Resource Collector] : ', 'edit-list', 'click');

        document.getElementById('list-input-modal').classList.toggle('showed', true);
        document.getElementById('list-input-area').value = downloadSites.sites.map((site) => {
            return site.url;
        }).join('\n');
    });

    document.getElementById('list-input-modal-container')
        .querySelector('.modal-okay')
        .addEventListener('click', () => {
            document.getElementById('list-input-modal').classList.toggle('showed', false);
            downloadSites.sites = document.getElementById('list-input-area').value.split('\n').filter((url) => {
                return url.startsWith('http');
            }).map((url) => {
                return {
                    url,
                    isDownloading: false,
                    isDownloaded: false,
                    isFailed: false,
                };
            });
            document.getElementById('list-sites').innerHTML = downloadSites.listHtml;
        });

    document.getElementById('list-input-modal-container')
        .querySelector('.modal-close')
        .addEventListener('click', () => {
            document.getElementById('list-input-modal').classList.toggle('showed', false);
        });

    document.getElementById('check-xhr').addEventListener('change', (e) => {
        console.log('[Resource Collector] : ', 'check-xhr', 'change', 'e', e);
        if (e.target.checked) {
            appState.isWaitingForReload = true;
            // If change from false to true
            document.getElementById('label-xhr').innerHTML = 'Reloading page for collecting XHR requests ...'; //Include all assets by XHR requests
            document.getElementById('up-save').innerHTML = 'Waiting for reload';
            document.getElementById('up-save').disabled = true;
            // Add listener, only when the check box is from unchecked to checked
            chrome.tabs.onUpdated.addListener(tabCompleteForXHRHandler);
            chrome.tabs.reload(chrome.devtools.inspectedWindow.tabId, null, () => {
                e.target.disabled = true;
            });
        } else {
            // If change from true to false
            // Reset Resource Collector
            resetResourceCollector();
        }
        setResourceCount();
    });

    chrome.tabs.get(chrome.devtools.inspectedWindow.tabId, (tab) => {
        downloadSites.sites = [{
            url: tab.url,
            isDownloading: false,
            isDownloaded: false,
            isFailed: false,
        },];
        document.getElementById('list-sites').innerHTML = downloadSites.listHtml;
    });

    chrome.devtools.inspectedWindow.getResources((resources) => {
        console.log('[Resource Collector] : ', 'chrome.devtools.inspectedWindow.getResources', 'resources', resources);
        if (!appState.isDownloading) {
            document.getElementById('status').innerHTML = 'Static resources count: ' + resources.length;
        }
    });

    //This can be used for identifying when ever a download is done (state from in_processing to complete)
    //	chrome.downloads.onChanged.addListener((downloadItem) =>{
    //		console.log('Download Updated': downloadItem);
    //	});

    //This can be used for identifying when ever a new resource is added
    chrome.devtools.inspectedWindow.onResourceAdded.addListener((resource) => {
      console.log('[Resource Collector] : ', 'chrome.devtools.inspectedWindow.onResourceAdded.addListener', 'resource', resource);
        if (resource.url.indexOf('http') === 0) {
            // alert("resources added -> " + resource.url);
            // alert("resources content added " + resource.content);
            //      console.log('Resource Added: ', resource.url);
            // document.getElementById('debug').innerHTML += resource.url + '\n';
        }
    });

    //This can be used to detect when ever a resource code is changed/updated
    chrome.devtools.inspectedWindow.onResourceContentCommitted.addListener((resource, content) => {
      console.log('[Resource Collector] : ', 'chrome.devtools.inspectedWindow.onResourceContentCommitted.addListener', 'resource', resource, 'content', content);

        // alert("Resource Changed");
        // alert("New Content  " + content);
        // alert("New Resource  Object is " + resource);
        //    console.log('Resource Commited: ', resource.url);
    });
});

const tabCompleteForXHRHandler = (tabId, changeInfo, keepDisabled) => {
    console.log('[Resource Collector] : ', 'tabCompleteForXHRHandler', 'tabId', tabId, 'changeInfo', changeInfo, 'keepDisabled', keepDisabled);
    if (tabId === chrome.devtools.inspectedWindow.tabId && changeInfo.status === 'complete') {
        appState.isDownloading = false;
        appState.isDownloaded = false;
        appState.isWaitingForReload = false;

        document.getElementById('check-xhr').checked = true;
        document.getElementById('check-xhr').disabled = false;
        document.getElementById('label-xhr').innerHTML = 'Include all assets by XHR requests (require page reload).';
        document.getElementById('up-save').innerHTML = 'Save All Resources';
        document.getElementById('up-save').disabled = false;
        // Remove listener from further same event
        chrome.tabs.onUpdated.removeListener(tabCompleteForXHRHandler);
    }
};

const getXHRs = (callback) => {
    console.log('[Resource Collector] : ', 'getXHRs', 'callback', callback);
    var xhrResources = [];
    if (document.getElementById('check-xhr').checked) {
        chrome.devtools.network.getHAR((logInfo) => {
          console.log('[Resource Collector] : ', 'chrome.devtools.network.getHAR', 'logInfo', logInfo);

            logInfo.entries.map((entry) => {
                if (appState.reqs[entry.request.url]) {
                    console.log('Found in Resource Collector: ', entry.request.url);
                    xhrResources.push(Object.assign({}, entry.request, {
                        getContent: (cb) => {
                            cb(appState.reqs[entry.request.url].body, appState.reqs[entry.request.url].encoding);
                            return true;
                        },
                        type: entry.response.content.mimeType || 'text/plain',
                        isStream: false
                    }));
                } else {
                    xhrResources.push(Object.assign({}, entry.request, {
                        getContent: entry.getContent,
                        type: entry.response.content.mimeType || 'text/plain',
                        isStream: (entry.response.content.mimeType || '').indexOf('event-stream') !== -1
                    }));
                }
            });
            callback(xhrResources);
        });
    } else {
        callback(xhrResources);
    }
};

// Convert all async getContent to sync getContent
const processContentFromResources = (combineResources, cb) => {
    console.log('[Resource Collector] : ', 'processContentFromResources', 'combineResources', combineResources, 'cb', cb);
    var count = 0;
    combineResources.forEach((item, index) => {
        // Give timeout of 5000ms for the callback,
        // if the getContent callback cannot return in time, we move on
        var getContentTimeout = setTimeout(() => {
            count++;
            // Callback when all done
            if (count === combineResources.length) {
                cb(combineResources);
            }
        }, 5000);
        item.getContent((body, encoding) => {
            console.log('[Resource Collector] : ', 'item.getContent', 'body', body, 'encoding', encoding);
            clearTimeout(getContentTimeout);
            combineResources[index].getContent = (cb) => {
                console.log('[Resource Collector] : ', 'getContent', 'cb', cb);
                cb(body, encoding);
            };
            count++;
            if (count === combineResources.length) {
                cb(combineResources);
            }
        });
    });
};

const cleanUrlForComparison = (url) => {
    console.log('[Resource Collector] : ', 'cleanUrlForComparison', 'url', url);
    return url.replace(/\//g, '').replace(/#.*/, '');
};

const saveAllResourcesFromList = async (e) => {
    console.log('[Resource Collector] : ', 'saveAllResourcesFromList', 'e', e);

    appState.isDownloading = true;

    // Disable button
    e.target.innerHTML = 'Downloading...';
    e.target.disabled = true;

    var idx = 0;
    for (var site of downloadSites.sites) {
        resetResourceCollector();
        try {
            await new Promise((resolve, reject) => {
                var currentSite = Object.assign({}, site);
                var currentIdx = idx;
                var tabChangeHandler = (tabId, changeInfo) => {
                    console.log('[Resource Collector] : ', 'tabChangeHandler', 'tabId', tabId, 'changeInfo', changeInfo);
                    if (tabId === chrome.devtools.inspectedWindow.tabId && changeInfo && changeInfo.status) {
                        if (changeInfo.status === 'loading') {
                            return updateListSites(currentIdx, {
                                url: currentSite.url,
                                isDownloading: true,
                                isDownloaded: false,
                                isFailed: false
                            });
                        }
                        if (changeInfo.status === 'complete') {
                            chrome.tabs.onUpdated.removeListener(tabChangeHandler);
                            chrome.devtools.network.getHAR(result => {
                                console.log('[Resource Collector] : ', 'chrome.devtools.network.getHAR', 'result', result);

                                var foundPage = result.pages.find((page) => {
                                    return cleanUrlForComparison(page.title) === cleanUrlForComparison(currentSite.url);
                                });
                                if (foundPage) {
                                    setTimeout(() => {
                                        saveAllResources(e, (isSuccess) => {
                                            if (isSuccess) {
                                                updateListSites(currentIdx, {
                                                    url: currentSite.url,
                                                    isDownloading: false,
                                                    isDownloaded: true,
                                                    isFailed: false
                                                });
                                                return resolve();
                                            } else {
                                                updateListSites(currentIdx, {
                                                    url: currentSite.url,
                                                    isDownloading: false,
                                                    isDownloaded: false,
                                                    isFailed: true
                                                });
                                                return reject('Failed to load site ' + currentSite.url);
                                            }
                                        });
                                    }, 3000);
                                } else {
                                    updateListSites(currentIdx, {
                                        url: currentSite.url,
                                        isDownloading: false,
                                        isDownloaded: false,
                                        isFailed: true
                                    });
                                    return reject('Failed to load site ' + currentSite.url);
                                }
                            });
                        }
                    }
                };
                chrome.tabs.onUpdated.addListener(tabChangeHandler);
                setTimeout(() => {
                    console.log('[Resource Collector] : ', 'setTimeout', '', );
                    chrome.tabs.update(chrome.devtools.inspectedWindow.tabId, {
                        url: currentSite.url
                    });
                }, 500);
            });
        } catch (error) {
            console.log("ERROR SAVE: ", error);
        }
        idx++;
    }
    resetListSites();
};

const saveAllResources = (e, callback) => {
    console.log('[Resource Collector] : ', 'saveAllResources', 'e', e, 'callback', callback);
    var toDownload = [];
    var downloadThread = 5;

    // Downloading flag
    appState.isDownloading = true;

    // Disable XHR Checkbox
    document.getElementById('check-xhr').disabled = true;

    // Reset Report Table
    reportElement.innerHTML = '';
    reportFailedElement.innerHTML = '';
    document.getElementById('open-folder').innerHTML = '';
    document.getElementById('debug').innerHTML = '';

    getXHRs((xhrResources) => {

        console.log('[Resource Collector] : ', 'getXHRs', 'xhrResources', xhrResources);
        // Disable download notification
        chrome.downloads.setShelfEnabled(false);

        chrome.tabs.get(chrome.devtools.inspectedWindow.tabId, (tab) => {
            console.log('Save content from: ', tab.url);
            var domain = tab.url.split('://')[1].substring(0, tab.url.split('://')[1].indexOf('/'));
            //Fetching all available resources and filtering using name of script snippet added
            chrome.devtools.inspectedWindow.getResources((resources) => {
                console.log('[Resource Collector] : ', 'chrome.devtools.inspectedWindow.getResources', 'resources', resources);
                //		resources.map((item) => {
                //			console.log(item);
                //		})
                //		alert(resources);
                // This function returns array of resources available in the current window
                appState.isDownloading = true;
        
                // Disable button
                e.target.innerHTML = 'Downloading...';
                e.target.disabled = true;

                var allResources = xhrResources.concat(resources);

                processContentFromResources(allResources, (combineResources) => {
                    // Filter Resource here
                    if (document.getElementById('check-all').checked) {
                        for (i = 0; i < combineResources.length; i++) {
                            if (!combineResources[i].url.includes('Chrome/Default/Extensions')) {
                                var foundIndex = toDownload.findIndex((item) => {
                                    return item.url === combineResources[i].url;
                                });
                                // Make sure unique URL
                                if (foundIndex === -1) {
                                    toDownload.push(combineResources[i]);
                                } else {
                                    // If the new one have content, replace with old one anyway
                                    var j = i;
                                    combineResources[j].getContent((body) => {
                                        if (!!body) {
                                            toDownload[foundIndex] = combineResources[j];
                                        }
                                    });
                                }
                            }
                        }
                    } else {
                        for (i = 0; i < combineResources.length; i++) {
                            if (!combineResources[i].url.includes('Chrome/Default/Extensions')) {
                                // Matching with current snippet URL
                                if (combineResources[i].url.indexOf('://' + domain) >= 0) {
                                    var foundIndex = toDownload.findIndex((item) => {
                                        return item.url === combineResources[i].url;
                                    });
                                    // Make sure unique URL
                                    if (foundIndex === -1) {
                                        toDownload.push(combineResources[i]);
                                    } else {
                                        // If the new one have content, replace with old one anyway
                                        var j = i;
                                        combineResources[j].getContent((body) => {
                                            if (!!body) {
                                                toDownload[foundIndex] = combineResources[j];
                                            }
                                        });
                                    }
                                }
                            }
                        }
                    }

                    console.log('Combine Resource: ', combineResources);
                    console.log('Download List: ', toDownload);

                    // window.alll = toDownload;

                    if (document.getElementById('check-zip').checked) {
                        // No need to turn off notification for only one zip file
                        chrome.downloads.setShelfEnabled(true);

                        downloadZipFile(toDownload, (isSuccess) => {
                            allDone(isSuccess);
                            callback(isSuccess);
                        });
                    } else {
                        downloadListWithThread(toDownload, downloadThread, (isSuccess) => {
                            allDone(isSuccess);
                            callback(isSuccess);
                        });
                    }
                });
            });
        });
    });
};

const allDone = (isSuccess) => {
    console.log('[Resource Collector] : ', 'allDone', 'isSuccess', isSuccess);
    // Default value
    if (typeof isSuccess === 'undefined') {
        isSuccess = true;
    }

    // Downloading flag
    appState.isDownloading = false;
    appState.isDownloaded = true;

    // Enable XHR Checkbox
    document.getElementById('check-xhr').disabled = false;

    // Re-enable Download notification
    chrome.downloads.setShelfEnabled(true);

    // Push reportElement to debugElement
    document.getElementById('debug').insertBefore(reportElement, document.getElementById('debug').childNodes[0]);
    document.getElementById('debug').insertBefore(reportFailedElement, document.getElementById('debug').childNodes[0]);

    var endStatus = document.createElement('p');

    // Report in the end
    if (isSuccess) {
        appState.isDownloaded = true;

        endStatus.className = 'all-done';
        endStatus.innerHTML = 'Downloaded All Files !!!';
        document.getElementById('debug').insertBefore(endStatus, document.getElementById('debug').childNodes[0]);

        var openDownload = document.createElement('button');
        openDownload.innerHTML = 'Open';
        openDownload.addEventListener('click', () => {
            chrome.downloads.showDefaultFolder();
        });
        document.getElementById('open-folder').innerHTML = 'Resources Folder: ';
        document.getElementById('open-folder').appendChild(openDownload);

    } else {
        endStatus.className = 'all-done';
        endStatus.innerHTML = 'Something went wrong, please try again or contact support for the issue.';
        document.getElementById('debug').insertBefore(endStatus, document.getElementById('debug').childNodes[0]);
    }

    // Restore/Change button state
    document.getElementById('up-save').innerHTML = 'Re-Download?';
    document.getElementById('up-save').disabled = false;
};

const downloadListWithThread = (toDownload, threadCount, callback) => {
    console.log('[Resource Collector] : ', 'downloadListWithThread', 'toDownload', toDownload, 'threadCount', threadCount, 'callback', callback);
    document.getElementById('status').innerHTML = 'Files to download: ' + toDownload.length;
    var currentList = toDownload.slice(0, threadCount);
    var restList = toDownload.slice(threadCount);
    downloadURLs(currentList, () => {
        if (currentList.length > 0 && restList.length > 0) {
            downloadListWithThread(restList, threadCount, callback);
        } else {
            callback();
        }
    });
};

const resolveURLToPath = (cUrl, cType, cContent) => {
    console.log('[Resource Collector] : ', 'resolveURLToPath', 'cUrl', cUrl, 'cType', cType, 'cContent', cContent);
    var filepath, filename, isDataURI;
    var foundIndex = cUrl.search(/\:\/\//);
    // Check the url whether it is a link or a string of text data
    if ((foundIndex === -1) || (foundIndex >= 10)) {
        isDataURI = true;
        console.log('Data URI Detected!!!!!');

        if (cUrl.indexOf('data:') === 0) {
            var dataURIInfo = cUrl.split(';')[0].split(',')[0].substring(0, 30).replace(/[^A-Za-z0-9]/g, '.');
            // console.log('=====> ',dataURIInfo);
            filename = dataURIInfo + '.' + Math.random().toString(16).substring(2) + '.txt';
        } else {
            filename = 'data.' + Math.random().toString(16).substring(2) + '.txt';
        }

        filepath = '_DataURI/' + filename;
    } else {
        isDataURI = false;
        if (cUrl.split('://')[0].includes('http')) {
            // For http:// https://
            filepath = cUrl.split('://')[1].split('?')[0];
        } else {
            // For webpack:// ng:// ftp://
            filepath = cUrl.replace('://', '---').split('?')[0];
        }
        if (filepath.charAt(filepath.length - 1) === '/') {
            filepath = filepath + 'index.html';
        }
        filename = filepath.substring(filepath.lastIndexOf('/') + 1);
    }

    // Get Rid of QueryString after ;
    filename = filename.split(';')[0];
    filepath = filepath.substring(0, filepath.lastIndexOf('/') + 1) + filename;

    // Add default extension to non extension filename
    if (filename.search(/\./) === -1) {
        var haveExtension = null;
        if (cType && cContent) {
            // Special Case for Images with Base64
            if (cType.indexOf('image') !== -1) {
                if (cContent.charAt(0) == '/') {
                    filepath = filepath + '.jpg';
                    haveExtension = 'jpg';
                }
                if (cContent.charAt(0) == 'R') {
                    filepath = filepath + '.gif';
                    haveExtension = 'gif';
                }
                if (cContent.charAt(0) == 'i') {
                    filepath = filepath + '.png';
                    haveExtension = 'png';
                }
            }
            // Stylesheet | CSS
            if (cType.indexOf('stylesheet') !== -1 || cType.indexOf('css') !== -1) {
                filepath = filepath + '.css';
                haveExtension = 'css';
            }
            // JSON
            if (cType.indexOf('json') !== -1) {
                filepath = filepath + '.json';
                haveExtension = 'json';
            }
            // Javascript
            if (cType.indexOf('javascript') !== -1) {
                filepath = filepath + '.js';
                haveExtension = 'js';
            }
            // HTML
            if (cType.indexOf('html') !== -1) {
                filepath = filepath + '.html';
                haveExtension = 'html';
            }

            if (!haveExtension) {
                filepath = filepath + '.html';
                haveExtension = 'html';
            }
        } else {
            // Add default html for text document
            filepath = filepath + '.html';
            haveExtension = 'html';
        }
        filename = filename + '.' + haveExtension;
        console.log('File without extension: ', filename, filepath);
    }

    // Remove path violation case
    filepath = filepath
        .replace(/\:|\\|\=|\*|\.$|\"|\'|\?|\~|\||\<|\>/g, '')
        .replace(/\/\//g, '/')
        .replace(/(\s|\.)\//g, '/')
        .replace(/\/(\s|\.)/g, '/');

    filename = filename
        .replace(/\:|\\|\=|\*|\.$|\"|\'|\?|\~|\||\<|\>/g, '');

    // Decode URI
    if (filepath.indexOf('%') !== -1) {
        try {
            filepath = decodeURIComponent(filepath);
            filename = decodeURIComponent(filename);
        } catch (err) {
            console.log(err);
        }
    }

    // Strip double slashes
    while (filepath.includes('//')) {
        filepath = filepath.replace('//', '/');
    }

    // Strip the first slash '/src/...' -> 'src/...'
    if (filepath.charAt(0) === '/') {
        filepath = filepath.slice(1);
    }

    //  console.log('Save to: ', filepath);
    //  console.log('File name: ',filename);

    return {
        path: filepath,
        name: filename,
        dataURI: isDataURI && cUrl
    };
};

const downloadURLs = (urls, callback) => {
    console.log('[Resource Collector] : ', 'downloadURLs', 'urls', urls, 'callback', callback);
    var currentDownloadQueue = [];
    urls.forEach((currentURL, index) => {
        console.log('Current request: ', currentURL);
        var cUrl = currentURL.url;
        var cType = currentURL.type;
        var resolvedURL = resolveURLToPath(cUrl);

        var filepath = resolvedURL.path;
        var filename = resolvedURL.name;

        console.log('Save to: ', filepath);

        currentDownloadQueue.push({
            index: index,
            url: cUrl,
            resolved: false
        });

        if (document.getElementById('check-cache').checked && currentURL.getContent) {
            currentURL.getContent((content, encoding) => {
                console.log('[Resource Collector] : ', 'currentURL.getContent', 'content', content, 'encoding', encoding);
                var currentEnconding = encoding;
                if (filename.search(/\.(png|jpg|jpeg|gif|ico|svg)/) !== -1) {
                    currentEnconding = 'base64';
                }

                var currentContent, finalURI;

                if (resolvedURL.dataURI) {
                    currentContent = content;
                    finalURI = 'data:text/plain;charset=UTF-8,' + encodeURIComponent(resolvedURL.dataURI);
                } else {
                    currentContent = currentEnconding ? content : (() => {
                        try {
                            return btoa(content);
                        } catch (err) {
                            console.log('utoa fallback: ', currentURL.url);
                            return btoa(unescape(encodeURIComponent(content)));
                        }
                    })(); //btoa(unescape(encodeURIComponent(content)))

                    finalURI = 'data:text/plain;base64,' + currentContent;
                }

                try {
                    chrome.downloads.download({
                        url: finalURI, //currentURL.url
                        filename: 'All Resources/' + filepath,
                        saveAs: false
                    },
                        (downloadId) => {
                            var currentIndex = currentDownloadQueue.findIndex((item) => {
                                return item.index === index;
                            });
                            if (chrome.runtime.lastError) {
                                console.log('URI ERR: ', chrome.runtime.lastError, filepath); // , filepath, finalURI
                                // document.getElementById('status').innerHTML = 'Files to download: ERR occured';
                                currentDownloadQueue[currentIndex].resolved = true;
                                resolveCurrentDownload();
                            } else {
                                currentDownloadQueue[currentIndex].id = downloadId;
                                currentDownloadQueue[currentIndex].order = currentIndex;
                                //console.log('Create: ', JSON.stringify(currentDownloadQueue));
                                //console.log(currentDownloadQueue);
                                //chrome.downloads.search({
                                //  id: downloadId
                                //}, (item) => {
                                //  //console.log(item[0].state);
                                //})
                            }
                        }
                    );
                } catch (runTimeErr) {
                    console.log(runTimeErr);
                }
            });
        } else {
            try {
                chrome.downloads.download({
                    url: currentURL.url,
                    filename: 'All Resources/' + filepath,
                    saveAs: false
                },
                    (downloadId) => {
                        var currentIndex = currentDownloadQueue.findIndex((item) => {
                            return item.index === index;
                        });
                        if (chrome.runtime.lastError) {
                            console.log('URL ERR: ', chrome.runtime.lastError, filepath); // , filepath, finalURI
                            // document.getElementById('status').innerHTML = 'Files to download: ERR occured';
                            currentDownloadQueue[currentIndex].resolved = true;
                            resolveCurrentDownload();
                        } else {
                            currentDownloadQueue[currentIndex].id = downloadId;
                            currentDownloadQueue[currentIndex].order = currentIndex;
                            //console.log('Create: ', JSON.stringify(currentDownloadQueue));
                            //console.log(currentDownloadQueue);
                            //chrome.downloads.search({
                            //  id: downloadId
                            //}, (item) => {
                            //  //console.log(item[0].state);
                            //})
                        }
                    }
                );
            } catch (runTimeErr) {
                console.log(runTimeErr);
            }
        }

    });

    const resolveCurrentDownload = () => {
        console.log('[Resource Collector] : ', 'resolveCurrentDownload');

        var count = currentDownloadQueue.filter((item) => {
            return item.resolved === true;
        }).length;
        //console.log('Count: ', count, '---', urls.length);
        if (count === urls.length) {
            //console.log('Callback');
            currentDownloadQueue = [];
            callback();
        }
    };

    chrome.downloads.onChanged.addListener((downloadItem) => {

        console.log('[Resource Collector] : ', 'chrome.downloads.onChanged.addListener', 'downloadItem', downloadItem);
        var index = currentDownloadQueue.findIndex((item) => {
            return item.id === downloadItem.id;
        });
        if (index >= 0 && downloadItem.state) {
            //console.log(downloadItem.state.current);
            if (downloadItem.state.current === 'complete') {
                chrome.downloads.search({
                    id: downloadItem.id
                }, (item) => {
                    chrome.downloads.erase({
                        id: downloadItem.id
                    }, () => {
                        var newListUrl = currentDownloadQueue.find((item) => {
                            return item.id === downloadItem.id;
                        }).url;

                        if (newListUrl.indexOf('data:') === 0) {
                            newListUrl = 'DATA URI CONTENT';
                        }

                        var newList = document.createElement('ul');
                        newList.className = 'each-done';
                        newList.innerHTML = '<li>' + item[0].id + '</li><li class="success">Success</li><li>' + newListUrl + '</li>';
                        reportElement.insertBefore(newList, reportElement.childNodes[0]);
                        currentDownloadQueue[index].resolved = true;
                        resolveCurrentDownload();
                    });
                });
            } else if (downloadItem.state.current === 'interrupted') {
                chrome.downloads.search({
                    id: downloadItem.id
                }, (item) => {
                    chrome.downloads.erase({
                        id: downloadItem.id
                    }, () => {
                        var newList = document.createElement('ul');
                        newList.className = 'each-failed';
                        newList.innerHTML = '<li>' + item[0].id + '</li><li class="failed">Failed</li><li>' + item[0].url + '</li>';
                        reportFailedElement.insertBefore(newList, reportFailedElement.childNodes[0]);
                        currentDownloadQueue[index].resolved = true;
                        resolveCurrentDownload();
                    });
                });
            }
        }
    });
};

const downloadZipFile = (toDownload, callback) => {
    console.log('[Resource Collector] : ', 'downloadZipFile', 'toDownload', toDownload, 'callback', callback);
    if (zip) {
        zip.workerScriptsPath = "zip/";
        getAllToDownloadContent(toDownload, (result) => {
            // console.log('All ToDownload: ',result);
            // window.alll = result;
            //Double check duplicated
            var newResult = [];
            result.forEach((item) => {
                if (newResult.findIndex(i => i.url === item.url) === -1) {
                    newResult.push(item);
                } else {
                    // console.log('Final Duplicated: ', item.url);
                }
            });

            zip.createWriter(new zip.BlobWriter(), (blobWriter) => {
                addItemsToZipWriter(blobWriter, newResult, downloadCompleteZip.bind(this, blobWriter, callback));
            }, (err) => {
                console.log('ERROR: ', err);
                // Continue on Error, error might lead to corrupted zip, so might need to escape here
                callback(false);
            });
        });
    } else {
        callback(false);
    }
};

const getAllToDownloadContent = (toDownload, callback) => {
    console.log('[Resource Collector] : ', 'getAllToDownloadContent', 'toDownload', toDownload, 'callback', callback);
    // Prepare the file list for adding into zip
    var result = [];
    var pendingDownloads = toDownload.length;

    toDownload.forEach((item, index) => {
        if (item.getContent && !item.isStream) {
            // Give timeout of 5000ms for the callback,
            // if the getContent callback cannot return in time, we move on
            var getContentTimeout = setTimeout(() => {
                pendingDownloads--;
                // Callback when all done
                if (pendingDownloads === 0) {
                    callback(result);
                }
            }, 5000);

            item.getContent((body, encode) => {

                console.log('[Resource Collector] : ', 'item.getContent', 'body', body, 'encode', encode);
                // Cancel the timeout above
                clearTimeout(getContentTimeout);

                // console.log(index,': ',encode,'---->',body ? body.substring(0,20) : null);
                var resolvedItem = resolveURLToPath(item.url, item.type, body);
                var newURL = resolvedItem.path;
                var filename = resolvedItem.name;
                var currentEnconding = encode || null;

                if (filename.search(/\.(png|jpg|jpeg|gif|ico|svg)/) !== -1) {
                    currentEnconding = 'base64';
                }

                if (resolvedItem.dataURI) {
                    currentEnconding = null;
                }

                // Make sure the file is unique, otherwise exclude
                var foundIndex = result.findIndex((currentItem) => {
                    return currentItem.url === newURL;
                });

                // Only add to result when the url is unique
                if (foundIndex === -1) {
                    result.push({
                        name: filename,
                        type: item.type || 'text/plain',
                        originalUrl: item.url,
                        url: newURL, // Actually the path
                        content: resolvedItem.dataURI || body,
                        encoding: currentEnconding
                    });
                } else {
                    // console.log('XXX: ',newURL, item.url);
                    // Otherwise add suffix to the path and filename
                    var newFilename = filename.split('.')[0] + '-' + Math.random().toString(16).substring(2) + '.' + filename.split('.')[1];
                    var newPath = newURL.toString().replace(filename, newFilename);
                    console.log('Duplicated: ', newFilename, newPath, filename, newURL);
                    // console.log(filename + ' ------- ' + newURL);
                    result.push({
                        name: newFilename,
                        type: item.type || 'text/plain',
                        originalUrl: item.url,
                        url: newPath,
                        content: resolvedItem.dataURI || body,
                        encoding: currentEnconding
                    });
                }

                // Update status bar
                document.getElementById('status').innerHTML = 'Timeout in 5sec - Fetched: ' + resolvedItem.path;

                pendingDownloads--;

                // Callback when all done
                if (pendingDownloads === 0) {
                    // window.alll = result;
                    callback(result);
                }

                if (chrome.runtime.lastError) {
                    console.log(chrome.runtime.lastError);
                }
            });
        } else {
            pendingDownloads--;
            // Callback when all done
            if (pendingDownloads === 0) {
                callback(result);
            }
        }
    });
};

const addItemsToZipWriter = (blobWriter, items, callback) => {
    console.log('[Resource Collector] : ', 'addItemsToZipWriter', 'blobWriter', blobWriter, 'items', items, 'callback', callback,);
    var item = items[0];
    var rest = items.slice(1);

    // if item exist so add it to zip
    if (item) {
        // Try to beautify JS,CSS,HTML here
        if (js_beautify &&
            html_beautify &&
            css_beautify &&
            document.getElementById('check-beautify').checked &&
            item.name &&
            item.content
        ) {
            var fileExt = item.name.match(/\.([0-9a-z]+)(?:[\?#]|$)/);
            switch (fileExt ? fileExt[1] : '') {
                case 'js': {
                    console.log(item.name, ' will be beautified!');
                    item.content = js_beautify(item.content);
                    break;
                }
                case 'html': {
                    console.log(item.name, ' will be beautified!');
                    item.content = html_beautify(item.content);
                    break;
                }
                case 'css': {
                    console.log(item.name, ' will be beautified!');
                    item.content = css_beautify(item.content);
                    break;
                }
            }
        }

        // Check whether base64 encoding is valid
        if (item.encoding === 'base64') {
            // Try to decode first
            try {
                var tryAtob = atob(item.content);
            } catch (err) {
                console.log(item.url, ' is not base64 encoding, try to encode to base64.');
                try {
                    item.content = btoa(item.content);
                } catch (err) {
                    console.log(item.url, ' failed to encode to base64, fallback to text.');
                    item.encoding = null;
                }
            }
        }

        // Create a reader of the content for zip
        var resolvedContent = (item.encoding === 'base64') ?
            new zip.Data64URIReader(item.content || '') :
            new zip.TextReader(item.content || 'No Content: ' + item.originalUrl);

        var isNoContent = !item.content;

        // Create a Row of Report Table
        var newList = document.createElement('ul');

        // Make sure the file has some byte otherwise no import to avoid corrupted zip
        resolvedContent.init(() => {
            console.log('[Resource Collector] : ', 'resolvedContent.init', '', );
            if (resolvedContent.size > 0) {
                if (!isNoContent) {
                    console.log(resolvedContent.size, item.encoding || 'No Encoding', item.url, item.name);
                    blobWriter.add(item.url, resolvedContent,
                        () => {
                            // On Success, to the next item
                            addItemsToZipWriter(blobWriter, rest, callback);

                            // Update Status
                            document.getElementById('status').innerHTML = 'Compressed: ' + item.url;

                            // Update Report Table
                            newList.className = 'each-done';
                            newList.innerHTML = '<li>Added</li><li class="success">Done</li><li>' + item.url + '</li>';
                            reportElement.insertBefore(newList, reportElement.childNodes[0]);
                        },
                        () => {
                            // On Progress
                        }
                    );
                } else {
                    if (document.getElementById('check-content').checked) {
                        blobWriter.add(item.url, resolvedContent,
                            () => {
                                // On Success, to the next item
                                addItemsToZipWriter(blobWriter, rest, callback);

                                // Update Status
                                document.getElementById('status').innerHTML = 'Compressed: ' + item.url;

                                // Update Report Table
                                newList.className = 'each-done';
                                newList.innerHTML = '<li>Added</li><li class="success"><b>No Content</b></li><li>' + item.url + '</li>';
                                reportFailedElement.insertBefore(newList, reportFailedElement.childNodes[0]);
                            },
                            () => {
                                // On Progress
                            }
                        );
                    } else {
                        console.log('EXCLUDED: ', item.url);

                        // Update Status
                        document.getElementById('status').innerHTML = 'Excluded: ' + item.url;

                        // Update Report Table
                        newList.className = 'each-failed';
                        newList.innerHTML = '<li>Ignored</li><li class="failed"><b>No Content</b></li><li>' + item.url + '</li>';
                        reportFailedElement.insertBefore(newList, reportFailedElement.childNodes[0]);

                        // To the next item
                        addItemsToZipWriter(blobWriter, rest, callback);
                    }
                }
            } else {
                // If no size, exclude the item
                console.log('EXCLUDED: ', item.url);

                // Update Status
                document.getElementById('status').innerHTML = 'Excluded: ' + item.url;

                // Update Report Table
                newList.className = 'each-failed';
                newList.innerHTML = '<li>Ignored</li><li class="failed">Request Failed</li><li>' + item.url + '</li>';
                reportFailedElement.insertBefore(newList, reportFailedElement.childNodes[0]);

                // To the next item
                addItemsToZipWriter(blobWriter, rest, callback);
            }
        });

    } else {
        // Callback when all done
        callback();
    }
    return rest;
};

//const downloadCompleteZip = (blobWriter, callback) => {
//  console.log('[Resource Collector] : ', 'downloadCompleteZip', 'blobWriter', blobWriter, 'callback', callback);
//	// Close the writer and save it by dataURI
//	blobWriter.close((blob) => {
//		chrome.downloads.download({
//			url: URL.createObjectURL(blob),
//			filename: 'All Resources/all.zip',
//			saveAs: false
//		}, () => {
//			if (chrome.runtime.lastError) {
//				callback(false);
//			} else {
//				callback(true);
//			}
//		});
//	});
//}

const downloadCompleteZip = (blobWriter, callback) => {
    console.log('[Resource Collector] : ', 'downloadCompleteZip', 'blobWriter', blobWriter, 'callback', callback);
    blobWriter.close((blob) => {
        chrome.tabs.get(
            chrome.devtools.inspectedWindow.tabId,
            (tab) => {
                var url = new URL(tab.url);
                var filename = url.hostname ? url.hostname.replace(/([^A-Za-z0-9\.])/g, "_") : 'all';
                var a = document.createElement('a');
                a.href = URL.createObjectURL(blob);
                a.download = filename + '.zip';
                a.click();
                callback(true);
            });
    });
};

// Returns a function, that, as long as it continues to be invoked, will not
// be triggered. The function will be called after it stops being called for
// N milliseconds. If `immediate` is passed, trigger the function on the
// leading edge, instead of the trailing.
const debounce = (func, wait, immediate) => {
    console.log('[Resource Collector] : ', 'debounce', 'func', func, 'wait', wait, 'immediate', immediate,);
    var timeout;
    return () => {
        var context = this,
            args = arguments;
        var later = () => {
            console.log('[Resource Collector] : ', 'later');
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        var callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
};

// console.log('Hello from -> Content');

// Communication between tab and extension
// Inject a message sending from an active tab
// setTimeout(() => {
//     chrome.tabs.executeScript(chrome.devtools.inspectedWindow.tabId, {
//         code: 'window.addEventListener("load", () => { chrome.runtime.sendMessage({type: "RELOADED"}); }, false); window.onload = () => { chrome.runtime.sendMessage({type: "RELOADED"}); };'
//     });
// }, 3000);

// Communication between tab and extension
// Function when this extension get an message event and react that
// chrome.runtime.onMessage.addListener(
//     (request, sender, sendResponse) => {
//         console.log('>>>>>> ', request.type, sender.tab.id, chrome.devtools.inspectedWindow.tabId);
//         chrome.devtools.network.getHAR(result => console.log('EVENT HAR:', result))
// if (request.type === 'RELOADED' && sender.tab.id === chrome.devtools.inspectedWindow.tabId) {
// 	document.getElementById('check-xhr').checked = true;
// 	document.getElementById('check-xhr').disabled = false;
// 	document.getElementById('label-xhr').innerHTML = 'Include all assets by XHR requests'
// 	document.getElementById('up-save').innerHTML = 'Save All Resources';
// 	document.getElementById('up-save').disabled = false;
// }
//     }
// );

// resources[i].getContent((content, encoding) => {
//	alert("encoding is " + encoding);
//	alert("content is  " + content);
// 	document.getElementById('debug').innerHTML += '<p>'+ cUrl +'</p>';
// });