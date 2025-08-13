export const formatReviewsResponse = (reviews) => {
  return reviews.map((review) => ({
    user: {
      username: review.user?.username || null,
      avatarUrl: review.user?.avatarUrl || null,
    },
    rating: review.rating,
    comment: review.comment,
    createdAt: review.createdAt,
  }))
}

export const formatUserRewardsResponse = (userRewards) => {
  return userRewards.map((userReward) => {
    userReward = userReward.toJSON()
    return {
      ...userReward,
      ...userReward.reward,
      reward: undefined,
    }
  })
}
