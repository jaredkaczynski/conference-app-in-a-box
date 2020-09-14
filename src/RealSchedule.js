'use strict';


import Domerate from "./libs/domerate";
import moment from 'moment-timezone'

class Event {
    constructor(schedule, params) {
        this.schedule = schedule;
        this.id = params.id;
        this.start = moment(params.start * 1000);
        this.end = moment(params.end * 1000);
        this.startSlot = schedule.snapToStartTimeslot(this.start);
        this.endSlot = schedule.snapToEndTimeslot(this.start, this.end);
        this.slotCount = schedule.slotCount(this.startSlot, this.endSlot);
        this.channel = null;
        this.title = params.title;
        this.urlTitle = params.urlTitle;
        this.tags = params.tags;
        this.zone = null;
    }

    clone() {
        let copy = new Event(this.schedule, {
            id: this.id,
            start: this.start.unix(),
            end: this.end.unix(),
            title: this.title,
            urlTitle: this.urlTitle,
            tags: this.tags.slice()
        });

        copy.channel = this.channel;
        if (this.zone !== null) {
            copy.setTimeZone(this.zone);
        }

        return copy;
    }

    setTimeZone(zone) {
        this.zone = zone;
        this.start.tz(zone);
        this.end.tz(zone);
        this.startSlot = this.schedule.snapToStartTimeslot(this.start);
        this.endSlot = this.schedule.snapToEndTimeslot(this.start, this.end);
        this.slotCount = this.schedule.slotCount(this.startSlot, this.endSlot);
    }

    hasTag(tagId) {
        for (let tag of this.tags) {
            if (tag == tagId) {
                return true;
            }
        }
        return false;
    }
}

export class PAXSchedule {
    constructor(options = null) {
        if (options === null) {
            options = {};
        }

        if ('localStorage' in window) {
            this.zone = window.localStorage.getItem('tz');
        }
        if (this.zone == null) {
            if ('zone' in options) {
                this.zone = options.zone;
            } else {
                this.zone = moment.tz.guess();
            }
        }
        moment.tz.setDefault(this.zone);

        this.allEvents = [];
        this.days = [];
        this.daysOfMonth = [];
        this.currentDay = -1;
        this.minSnap = 15;
        this.snapsPerDay = 24 * (60 / this.minSnap);

        // This is the kludgey-est bit. We don't have extra fields to tie
        // this to, so we're just going to hardcode something here to identify
        // channels
        this.channelTags = {
            139: 'PAX',
            140: 'PAX2',
            141: 'PAX3',
            9: 'PAXArena'
        };

        this.filterTags = []

        // These are in order, and used to build the actual schedule html
        this.channelIds = [139, 140, 141, 9];
        if ('tags' in options) {
            let tmpIds = [];
            for (let tag of options.tags) {
                if (tag in this.channelTags) {
                    tmpIds.push(tag);
                } else {
                    this.filterTags.push(parseInt(tag));
                }
            }

            if (tmpIds.length > 0) {
                this.channelIds = tmpIds;
            }
        }
        this.hideBlankRows = false;

        if ('hideBlankRows' in options) {
            this.hideBlankRows = options.hideBlankRows;
        }

        this.restrictedId = 1;
        this.elementId = 'schedule-container';

        if ('elementId' in options) {
            this.elementId = options.elementId;
        }

        this.showFilters = true;
        if ('showFilters' in options) {
            this.showFilters = options.showFilters;
        }

        this.pagedDays = true;
        if ('pagedDays' in options) {
            this.pagedDays = options.pagedDays;
        }

        if ('acceptSearch' in options && options.acceptSearch) {
            let sp = new URLSearchParams(document.location.search.substring(1));
            let tags = sp.getAll("tag");
            let tmpIds = [];
            for (let tag of tags) {
                if (tag in this.channelTags) {
                    tmpIds.push(parseInt(tag));
                } else {
                    this.filterTags.push(parseInt(tag));
                }
            }

            if (tmpIds.length > 0) {
                this.channelIds = tmpIds;
            }
        }

        // Style can be 'grid' or 'list'
        this.style = 'grid';
        if ('style' in options) {
            this.style = options.style;
        }

        this.requireChannel = true;
        if ('requireChannel' in options) {
            this.requireChannel = options.requireChannel;
        }
    }

    loadData() {
        let req = new XMLHttpRequest();
        req.responseType = 'json';
        req.addEventListener('load', () => {
            // Completed succesfully
            this.addEvents(req.response);
        });
        req.addEventListener('abort', () => {
            // It thinks we cancelled the request
        });
        req.addEventListener('error', () => {
            // We got an error
        });

        let prefix = 'https://assets.paxsite.com/online/';
        if (document.location.hostname == 'localhost') {
            prefix = '/';
        }
        req.open('GET', prefix + 'schedule-export.json?t=' + Date.now(), true);
        req.send();
    }

    snapToStartTimeslot(m) {
        let snap = moment(m);
        snap.minute(this.minSnap * Math.floor(m.minute() / this.minSnap));
        return {
            time: snap,
            index: snap.diff(moment('2020-09-01')) / (this.minSnap * 60 * 1000)
        };
    }

    snapToEndTimeslot(start, m) {
        let snap = moment(m);
        snap.minute(this.minSnap * Math.ceil(m.minute() / this.minSnap - 1));
        return {
            time: snap,
            index: snap.diff(moment('2020-09-01')) / (this.minSnap * 60 * 1000)
        };
    }

    slotCount(start, end) {
        // This assumes that the times are already aligned to slot bounds
        return end.index - start.index + 1;
    }

    addEvents(dataset) {
        for (let eventDef of dataset.events) {
            let event = new Event(this, eventDef);
            for (let tag of event.tags) {
                if (tag in this.channelTags) {
                    event.channel = tag;
                    break;
                }
            }
            if (event.start.isAfter(event.end)) {
                // Sigh...hack...
                event.end.add(1, 'days');
                event.setTimeZone(this.zone);
            }
            this.allEvents.push(event);
        }

        this.allEvents.sort((a, b) => {
            if (a.start.isSame(b.start)) {
                if (a.channel == b.channel) {
                    return 0;
                } else {
                    return a.channel < b.channel ? -1 : 1;
                }
            } else if (a.start.isBefore(b.start)) {
                return -1;
            } else {
                return 1;
            }
        });

        this.generateSupportData();
        this.rebuildHtml();
    }

    generateSupportData() {
        this.days = {};
        this.daysOfMonth = [];
        for (let event of this.allEvents) {
            let startDay = event.start.date();
            let endDay = event.end.date();
            if (!(startDay in this.days)) {
                this.days[startDay] = {
                    weekday: moment.weekdaysShort(event.start.weekday()),
                    weekdayFull: moment.weekdays(event.start.weekday()),
                    events: []
                };
                this.daysOfMonth.push(startDay);
            }
            this.days[startDay].events.push(event);

            if (this.style == 'grid') {
                if (startDay != endDay && (event.end.hour() > 0 || event.end.minute() > 0)) {
                    // We span two days, ensure it shows up in both.
                    if (!(endDay in this.days)) {
                        this.days[endDay] = {
                            weekday: moment.weekdaysShort(event.end.weekday()),
                            events: []
                        };
                        this.daysOfMonth.push(endDay);
                    }
                    this.days[endDay].events.push(event);
                }
            }
        }
        this.currentDay = this.daysOfMonth[0];

        let today = moment();
        if (today.month() == 8 && today.date() in this.days) {
            this.currentDay = today.date();
        }

        if (document.location.hash != null && document.location.hash != '') {
            let sp = new URLSearchParams(document.location.hash.substring(1));
            if (sp.get('date') != null) {
                if (sp.get('date') in this.days) {
                    this.currentDay = parseInt(sp.get('date'));
                }
            }
        }
    }

    setTimeZone(zone) {
        this.zone = zone;
        if ('localStorage' in window) {
            window.localStorage.setItem('tz', this.zone);
        }
        moment.tz.setDefault(this.zone);
        for (let event of this.allEvents) {
            event.setTimeZone(zone);
        }

        this.generateSupportData();
        this.rebuildHtml();
    }

    * genDateNavTags(autoScroll = false) {
        yield {tag: 'li', class: 'title', text: 'Jump to date:'};
        for (let day of this.daysOfMonth) {
            yield {
                tag: 'li', children: [
                    {
                        tag: 'a', href: '#date=' + day, onClick: () => {
                            if (day != this.currentDay) {
                                this.currentDay = day;
                                this.rebuildHtml(autoScroll);
                            }
                        }, children: [
                            {text: this.days[day].weekday},
                            {tag: 'strong', text: day}
                        ]
                    }
                ], class: ((day == this.currentDay) ? 'active' : '')
            };
        }
    }

    * genTimeZoneOptions() {
        for (let zone of moment.tz.names()) {
            yield {
                tag: 'option',
                value: zone,
                text: zone.replace(/_/g, ' ').replace(/\//g, ' - '),
                selected: this.zone == zone
            };
        }
    }

    eventMatchesFilter(ev) {
        if (this.requireChannel) {
            if (this.channelIds.indexOf(ev.channel) < 0)
                return false;
        }

        if (this.filterTags.length > 0) {
            for (let ft of this.filterTags) {
                if (ev.hasTag(ft))
                    return true;
            }
            return false;
        }

        return true;
    }

    * genScheduleRows() {
        let dataSet = this.dayData;
        if (dataSet.length == 0) {
            yield {
                tag: 'tr', children: {
                    tag: 'td', class: 'empty',
                    colspan: this.channelIds.length + 1,
                    text: 'No events on this day'
                }
            };
            return;
        }

        let startTime = dataSet[0].start;
        let endTime = dataSet[dataSet.length - 1].end;
        let startIndex = startTime.index;
        let slotTime = moment.unix(startTime);
        let startSlot = this.snapToStartTimeslot(slotTime)
        let endSlot = this.snapToStartTimeslot(moment.unix(endTime))

        for (let slot = startSlot; slot <= endSlot; slot++) {
            let fillCount = 0;
            let dayStr = moment.weekdaysShort(slotTime.weekday());
            let dateStr = (slotTime.month() + 1) + '/' + slotTime.date();
            let fills = [
                {
                    tag: 'td', class: 'time', children: [
                        {
                            tag: 'p', children: [
                                {
                                    tag: 'b', children: [
                                        {text: dayStr + ' '},
                                        {tag: 'em', text: dateStr}
                                    ]
                                },
                                {text: slotTime.format(' h:mm a')},
                            ]
                        }
                    ]
                }
            ];
            for (let channel of this.channelIds) {
                let foundEvent = false;
                for (let event of dataSet) {
                    if (event.channel != channel)
                        continue;
                    if (event.startSlot.index == slot &&
                        event.startSlot.time.date() == slotTime.date()) {
                        let timeStr = event.start.format('ddd h:mm a') +
                            ' - ' + event.end.format('ddd h:mm a');
                        let evBody = [];
                        if (event.hasTag(this.restrictedId)) {
                            evBody.push({tag: 'b', text: '13+ '});
                        }
                        evBody.push({text: event.title});
                        fills.push({
                            tag: 'td', rowspan: event.slotCount, class: 'event',
                            children: [
                                {
                                    tag: 'a', href: '/schedule/panel/' + event.urlTitle, children: [
                                        {tag: 'p', text: timeStr},
                                        {tag: 'p', children: evBody}
                                    ]
                                }
                            ]
                        });
                        foundEvent = true;
                        break;
                    } else if (event.startSlot.index < slot &&
                        event.endSlot.index >= slot) {
                        foundEvent = true;
                        break;
                    }

                }
                if (foundEvent == false) {
                    fills.push({tag: 'td', text: ' '}); // &nbsp;
                } else {
                    fillCount++;
                }
            }
            if (!(this.hideBlankRows && fillCount == 0)) {
                yield {
                    tag: 'tr', children: fills
                };
            }
            slotTime.add(this.minSnap, 'minutes');
        }
    }

    buildGrid(dataset) {
        let dom = new Domerate();
        let elContainer = document.createElement("div");
        let specHeader = {
            tag: 'div', class: 'schedule', children: [
                {
                    tag: 'ul', class: 'nav dates', id: '#schedule',
                    children: this.genDateNavTags.bind(this),
                },
            ]
        }

        let specFilter = {
            tag: 'div', class: 'search float', text: 'TODO: Filters'
        };

        let headers = [
            {
                tag: 'th', class: 'time-zone', children: [
                    {tag: 'label', for: 'time-zone', text: 'Time Zone:'},
                    {
                        tag: 'select', id: 'time-zone', children:
                            this.genTimeZoneOptions.bind(this),
                        onChange: (ev) => {
                            this.setTimeZone(ev.target.value);
                        }
                    }
                ]
            }
        ];

        for (let cid of this.channelIds) {
            headers.push(
                {
                    tag: 'th', class: 'channel', children: [
                        {
                            tag: 'a', href: 'https://twitch.tv/' + this.channelTags[cid], children: [
                                {tag: 'strong', text: '/' + this.channelTags[cid]}
                            ]
                        }
                    ]
                }
            );
        }

        let specScheduleClass = 'schedule-table';
        if (this.channelIds.length < 4) {
            specScheduleClass += ' count-' + this.channelIds.length;
        }
        let specSchedule = {
            tag: 'table', class: specScheduleClass, children: [
                {
                    tag: 'thead', children: [
                        {tag: 'tr', class: 'nav', children: headers}
                    ]
                },
                {tag: 'tbody', children: this.genScheduleRows.bind(this)}
            ]
        };

        let scrollTarget = null;
        if (this.showFilters) {
            elContainer.appendChild(dom.generate(specFilter));
            elContainer.appendChild(dom.generate({tag: 'hr'}));
        }
        if (this.pagedDays) {
            scrollTarget = dom.generate(specHeader);
            elContainer.appendChild(scrollTarget);
            elContainer.appendChild(dom.generate({tag: 'hr'}));
        }
        elContainer.appendChild(dom.generate(specSchedule));
        if (this.pagedDays) {
            specHeader.children[0].args = [true];
            elContainer.appendChild(dom.generate({tag: 'hr'}));
            elContainer.appendChild(dom.generate(specHeader));
        }

        // if (autoScroll && scrollTarget !== null) {
        //     window.requestAnimationFrame(() => {
        //         window.requestAnimationFrame(() => {
        //             scrollTarget.scrollIntoView();
        //         });
        //     });
        // }
        return elContainer;
    }

    getEvClass(event) {
        if (event.hasTag(18)) { // Tournements
            return 'icon-tourney';
        }

        return '';
    }

    * genListDateNavTags(currentDay) {
        if (currentDay == this.daysOfMonth[0]) {
            yield {
                tag: 'li', class: 'title', children: [
                    {text: 'Time Zone:'},
                    {
                        tag: 'select', id: 'time-zone', children:
                            this.genTimeZoneOptions.bind(this),
                        onChange: (ev) => {
                            this.setTimeZone(ev.target.value);
                        }
                    }
                ]
            };
        } else {
            yield {tag: 'li', class: 'title', text: 'Jump to date:'};
        }
        for (let day of this.daysOfMonth) {
            yield {
                tag: 'li', children: [
                    {
                        tag: 'a', href: '#' + day, children: [
                            {text: this.days[day].weekday},
                            {tag: 'strong', text: day}
                        ]
                    }
                ], class: ((day == currentDay) ? 'active' : '')
            };
        }
    }

    * genListDay(day) {
        day = this.days[day];
        let lastTime = null;
        let slotDom = null;
        let evList = null;

        for (let event of day.events) {
            if (!this.eventMatchesFilter(event)) {
                continue;
            }
            let thisTime = event.start.format('h:mm A');
            if (lastTime != thisTime) {
                if (slotDom != null) {
                    yield slotDom;
                }
                evList = {tag: 'ul', class: 'events', children: []};
                slotDom = {
                    tag: 'li', class: 'time', children: [
                        {tag: 'h3', text: thisTime},
                        evList
                    ]
                };
                lastTime = thisTime;
            }

            evList.children.push({
                tag: 'li', class: this.getEvClass(event),
                children: [
                    {
                        tag: 'a',
                        href: '/schedule/panel/' + event.urlTitle,
                        text: event.title
                    }
                ]
            });
        }

        if (slotDom != null) {
            yield slotDom;
        }
    }

    buildList(elContainer) {
        let dom = new Domerate();

        for (let day in this.days) {
            elContainer.appendChild(dom.generate({
                tag: 'div', class: 'schedule', id: day, children: [
                    {
                        tag: 'ul', class: 'nav dates', id: '#schedule',
                        children: this.genListDateNavTags.bind(this),
                        args: [parseInt(day)]
                    },
                ]
            }));
            elContainer.appendChild(dom.generate({tag: 'hr'}));
            elContainer.appendChild(dom.generate({
                tag: 'h2', class: 'aria', text: this.days[day].weekdayFull
            }));
            elContainer.appendChild(dom.generate({
                tag: 'ul', class: 'day',
                children: this.genListDay.bind(this),
                args: [day]
            }));
        }
    }

    rebuildHtml(autoScroll = false) {
        let elContainer = document.getElementById(this.elementId);
        while (elContainer.children.length > 0) {
            elContainer.lastChild.remove();
        }

        switch (this.style) {
            case 'grid':
                this.buildGrid(elContainer, autoScroll);
                break;

            case 'list':
                this.buildList(elContainer);
                break;
        }
    }
}

/*
window.addEventListener('load', ()=>{
    let schedule = new Schedule();
    schedule.loadData();
});*/