import { IEvent, ICompoEntry, ICompo } from 'src/api/interfaces';

const mockEvent: IEvent = {
    id: 1,
    name: 'Intanssi 20017',
    date: '2018-02-08T20:31:43.000Z',
    mainurl: 'http://intanssi.org/20017',
};

export { mockEvent };

const mockCompoEntry: ICompoEntry = {
    id: 123,
    compo: 44,
    name: 'Stochastic Mock Coverage Tracer',
    description: '',
    creator: 'anon',
    entryfile_url: 'http://intanssi.org/files/123.zip',
    sourcefile_url: 'http://intanssi.org/files/123.src.zip',
    imagefile_original_url: 'http://intanssi.org/files/123.img.jpg',
    imagefile_thumbnail_url: 'http://intanssi.org/files/123.thumb.jpg',
    imagefile_medium_url: 'http://intanssi.org/files/123.med.jpg',
    youtube_url: 'http://youtube.com/foofoo',
    disqualified: false,
    disqualified_reason: '',
    score: 31.337,
    rank: 1,
};

export { mockCompoEntry };

const mockCompo: ICompo = {
    id: 420,
    event: 10,
    name: 'Testing compo',
    description: 'Compo for testing',
    adding_end: '2018-02-06T00:00:00.000Z',
    editing_end: '2018-02-06T00:00:00.000Z',
    compo_start: '2018-02-06T00:00:00.000Z',
    voting_start: '2018-02-06T00:00:00.000Z',
    voting_end: '2018-02-06T00:00:00.000Z',
    max_source_size: 8 * 2 ** 20,
    max_entry_size: 16 * 2 ** 20,
    max_image_size: 2 * 2 ** 20,
    source_format_list: ['rar', 'zip', '7z', 'tar.gz'],
    entry_format_list: ['rar', 'zip', '7z', 'tar.gz'],
    image_format_list: ['png', 'jpg'],
    show_voting_results: false,
    entry_view_type: 1,
    is_votable: true,
    is_imagefile_allowed: true,
    is_imagefile_required: true,
};

export { mockCompo };
