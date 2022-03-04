        Storage.prototype.setObject = function (key, value) {
            this.setItem(key, JSON.stringify(value));
        }

        Storage.prototype.getObject = function (key) {
            const value = this.getItem(key);
            return value && JSON.parse(value);
        }

        Storage.prototype.setGlobal = function (key, value) {
            if (typeof localStorage.globalSettings === undefined) {
                return;
            }

            let settings = localStorage.getObject('globalSettings');
            settings[key] = value;1

            localStorage.setObject('globalSettings', settings);

        }

        Storage.prototype.getGlobal = function (key) {
            let settings = localStorage.getObject('globalSettings');

            if (typeof settings[key] !== 'undefined') {
                return settings[key];
            }
        }

        if (typeof localStorage.globalSettings === 'undefined') {
            localStorage.setObject('globalSettings', {
                Volume: 1,
                History: {}
            });
        }