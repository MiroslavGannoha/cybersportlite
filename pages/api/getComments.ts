import cheerio from 'cheerio';
import { portalsDomains } from '../../settings';

export default (req, res) => {
    if (req.method === 'GET') {
        const { itemId } = req.query;
        const commentsUrl = `${portalsDomains.cybersport}/internal-api/comments/1/${itemId}/popular/5/0/0`;
        const likesUrl = `${portalsDomains.cybersport}/internal-api/likes?data=1|`;

        return fetch(commentsUrl)
            .then((response) => response.json())
            .then((data) => {
                if (!data.content) {
                    res.json([]);
                }
                const $ = cheerio.load(unescape(data.content.list), {
                    normalizeWhitespace: true,
                });

                const comments = $('.comments__message')
                    .map((index, el) => {
                        const text = $(el)
                            .find('.comment__text p')
                            .text()
                            .trim();
                        const author = $(el)
                            .find('.comment__name')
                            .text()
                            .trim();
                        let avatar = $(el).find('.user__pic img').attr('src');
                        const itemId = $(el).children('.comment').data().id;

                        if (avatar.indexOf('/') === 0) {
                            avatar = portalsDomains.cybersport + avatar;
                        }
                        return {
                            text,
                            author,
                            avatar,
                            likes: 0,
                            dislikes: 0,
                            itemId,
                        };
                    })
                    .toArray();

                const objectIdsQuery = comments
                    .map(({ itemId }) => itemId)
                    .join(',1|');

                fetch(likesUrl + objectIdsQuery)
                    .then((resp) => resp.json())
                    .then((data) => {
                        if(!data.content) {
                            res.json([]);
                        }
                        data.content.forEach(({ counter }) => {
                            const comment = comments.find(
                                ({ itemId }) =>
                                    itemId === counter.identity.objectId
                            );
                            comment.likes = counter.positiveCount;
                            comment.dislikes = counter.negativeCount;
                        });

                        res.json(comments);
                    });
                // res.setHeader('Content-Type', 'application/json');
                // res.end(JSON.stringify(comments.toArray()));
            });

        // Process a POST request
    } else {
        // Handle any other HTTP method
    }
};
