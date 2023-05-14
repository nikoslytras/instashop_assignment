Parse.Cloud.define('hello', req => {
  req.log.info(req);
  return 'Hi';
});

Parse.Cloud.define('asyncFunction', async req => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  req.log.info(req);
  return 'Hi async';
});

Parse.Cloud.beforeSave('Test', () => {
  throw new Parse.Error(9001, 'Saving test objects is not available.');
});

Parse.Cloud.define('login', async req => {
  const { username, password } = req.params;
  // throw error if username or password is not provided
  if (!username || !password) {
    throw new Parse.Error(400, 'username or password is not provided');
  }
  // login user
  const user = await Parse.User.logIn(username, password);

  //return the "objectId" and the "sessionToken" of the user.
  return {
    objectId: user.id,
    sessionToken: user.getSessionToken(),
  };
});

Parse.Cloud.define('signup', async req => {
  const { username, password } = req.params;
  if (!username || !password) {
    throw new Parse.Error(400, 'username or password is not provided');
  }
  const user = await Parse.User.signUp(username, password);
  return {
    objectId: user.id,
  };
});

async function getLandmarks() {
  const query = new Parse.Query('Landmark');
  const landmarks = await query.find();
  if (!landmarks?.length) {
    throw new Parse.Error(400, 'no landmarks found');
  }

  return landmarks.map(landmark => {
    return {
      title: landmark?.attributes?.title,
      info: landmark?.attributes?.info,
      file: landmark?.attributes?.file,
      fileName: landmark?.attributes?.fileName,
      link: landmark?.attributes?.link,
    };
  });
}

async function getLandmark(objectId) {
  const query = new Parse.Query('Landmark');
  query.equalTo('objectId', objectId);
  const landmark = await query.first();
  if (!landmark) {
    throw new Parse.Error(400, `no landmark found with id: ${objectId}`);
  }

  return landmark;
}

Parse.Cloud.define('getLandmarks', async req => {
  const landmarks = req.params.objectId
    ? await getLandmark(req.params.objectId)
    : await getLandmarks();
  return landmarks;
});

Parse.Cloud.define('createLandmark', async req => {
  const sessionToken_ = req.headers['x-parse-session-token'];
  if (!sessionToken_) {
    throw new Parse.Error(401, 'not authorized');
  }
  const Landmark = Parse.Object.extend('Landmark');
  const landmark = new Landmark();
  const { landmarkData } = req.params;
  if (!landmarkData) {
    throw new Parse.Error(400, 'landmarkData not found');
  }
  const newLandmark = await landmark.save({ ...landmarkData });
  return {
    id: newLandmark.id,
  };
});

Parse.Cloud.define('updateLandMark', async req => {
  const sessionToken = req.headers['x-parse-session-token'];
  if (!sessionToken) {
    throw new Parse.Error(401, 'not authorized');
  }

  const { objectId, dataToUpdate } = req.params;
  if (!objectId || !dataToUpdate) {
    throw new Parse.Error(400, 'objectId or dataToUpdate is not provided');
  }
  const query = new Parse.Query('Landmark');
  query.equalTo('objectId', objectId);
  const landmark = await query.first();
  if (!landmark) {
    throw new Parse.Error(400, `no landmark found with id: ${objectId}`);
  }
  for (const key in dataToUpdate) {
    landmark.set(key, dataToUpdate[key]);
  }
  const response = await landmark.save(null, { sessionToken });
  return response;
});
