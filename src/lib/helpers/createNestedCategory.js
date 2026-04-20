"use server";

export const createNestedCategory = async (items, parentId = null) => {
  let itemList = [];
  let filteredItem;
  if (parentId == null) {
    filteredItem = await items.filter((item) => item.parentId == undefined);
  } else {
    filteredItem = await items.filter((item) => item.parentId == parentId);
  }
  for (let v of filteredItem) {
    itemList.push({
      ...v?._doc,
      children: await createNestedCategory(items, v._id),
    });
  }
  // console.log(commentsList);
  return itemList;
};
