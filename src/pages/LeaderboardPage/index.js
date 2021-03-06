import React, { useMemo } from 'react';
import { connect } from 'react-redux';

import { CardFragment } from './fragments';
import { Preloader } from '../../components';
import './index.scss';

const _LeaderboardPage = ({ users, usersRequest, questionRequest }) => {
  const bestUsers = useMemo(() => {
    const bestUsers = [];

    if (users.length > 0) {
      users.forEach((user) => {
        const answered = Object.keys(user.answers).length;
        const created = user.questions.length;

        bestUsers.push({
          ...user,
          stats: {
            answered,
            created,
            scores: answered + created,
          },
        });
      });

      bestUsers.sort((a, b) => {
        return b.stats.scores - a.stats.scores;
      });
    }

    return bestUsers;
  }, [users]);

  if (usersRequest || questionRequest) {
    return <Preloader />;
  }

  return (
    <div className="leaderboard_page">
      <div className="leaderboard_page__title">Leader Board</div>
      <div className="leaderboard_page__content">
        {bestUsers.map((user, index) => (
          <CardFragment key={user.id} user={user} place={index + 1} />
        ))}
      </div>
    </div>
  );
};

const mapStateToProps = ({ users }) => ({
  users: users.users,
  usersRequest: users.users_request,
});

const LeaderboardPage = connect(mapStateToProps, null)(_LeaderboardPage);

export default LeaderboardPage;
