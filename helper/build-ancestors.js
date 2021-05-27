import User from "../models/user.model";

export const buildAncestors = async (id, parent_id) => {
  try {
    let parent_user = await User.findOne(
      { _id: parent_id },
      { name: 1, email: 1, slug: 1, ancestors: 1 }
    ).exec();
    if (parent_user) {
      const { _id, name, email, slug } = parent_user;
      const ancest = [...parent_user.ancestors];
      ancest.unshift({ _id, name, email, slug });
      const user = await User.findByIdAndUpdate(id, {
        $set: { ancestors: ancest },
      });
    }
  } catch (error) {
    console.log(error.message);
  }
};
