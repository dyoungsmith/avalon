// pretty much just want to update status to TEAMVOTE

import db from '../../../../db';

export default (getState) => {
	const { game: { gameId } } = getState();

	db.ref(`games/${gameId}`).update({status: 'TEAMVOTE'});
};
