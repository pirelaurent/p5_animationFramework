/*
    The reuse of a common config for several objects will share the data with obviously side effects. 
    The copyConfig ensure independancy of operational data against common definition 
*/

function copyConfig(source) {
  // the simplest way is to serialize then deserialize the structure
  var newConfig = JSON.parse(JSON.stringify(source));
  return newConfig;
}

function traceConfig(source) {
  return JSON.stringify(source);
}

/*
        update an existing config : 
        - change some item values with control that key already exists 
        - config parameter is directly modified 
        - change directly the config but also returned it to be used in static declaration 
             
    */
function patchConfig(config, modifier) {
  return patchConfigControlled(config, modifier, true, false);
}

// this time keys are not controlled, allows to add new specific entries without creating a new class
function extendConfig(config, modifier) {
  return patchConfigControlled(config, modifier, false, false);
}

// reverse between callers = extract data named in modifier
function extractConfig(config, modifier) {
  return patchConfigControlled(config, modifier, true, true);
}

// main function for update, controlled or not
function patchConfigControlled(
  config,
  modifier,
  controlled = true,
  reverse = false
) {
  // prepare console message
  let verb = " replaced by ";
  if (reverse) verb = " will replace ";

  // allways starts with modifier keys
  for (let key in modifier) {
    // check if key exists in config
    let configValue = config[key];
    // unknown key in current config,
    if (configValue == "undefined") {
      // extract : no change as not found, keep existing
      if (reverse) continue;
      // patch : controlled : error
      if (controlled) {
        // cannot be kept if no existing in control mode
        console.error(
          "wrong key: '" + key + "' not found into " + JSON.stringify(config)
        );
        continue;
      }
      // patch not controled : allow extension with new key.
      else {
        config[key] = modifier[key];
        console.debug(
          key + ":" + JSON.stringify(modifValue) + " has been added"
        );
        continue;
      }
    }

    // The key exists in both sides .
    //debug console.log(key+':  '+JSON.stringify(modifValue)+' will replace :'+JSON.stringify(configValue))
    // several cases can occurs :
    // the new value is an array : replace
    let modifValue = modifier[key];

    // array replace array ?
    if (modifValue instanceof Array) {
      // if control and previous was not an array : warn
      if (configValue instanceof Array == false) {
        console.debug(
          key +
            ":   " +
            JSON.stringify(configValue) +
            verb +
            JSON.stringify(modifValue)
        );
      } else // two arrays . same length ? 
      {
        if (modifValue.length != configValue.length){
          console.debug(
            key +
              ":   " +
              JSON.stringify(configValue) +
              " not the same length as " +
              JSON.stringify(modifValue)
          );
        }
      }
      if (reverse) modifier[key] = configValue;
      else config[key] = modifValue;
      continue;
    }
    // both keys are composed objects (and modifier is not an array) , recurse
    if (configValue instanceof Object && modifValue instanceof Object) {
      //debug console.log('recurse :::')
      patchConfigControlled(configValue, modifValue, controlled, reverse);
      continue;
    }

    // one is composed but not the other (due to upper if): replace but warn
    if (configValue instanceof Object || modifValue instanceof Object) {
      if (reverse) modifier[key] = configValue;
      else config[key] = modifValue;
      config[key] = modifValue;
      console.debug(
        key +
          ":" +
          JSON.stringify(configValue) +
          verb +
          JSON.stringify(modifValue)
      );
      continue;
    }
    // both are simple data
    if (reverse) modifier[key] = configValue;
    else config[key] = modifValue;
  } // for
  if (reverse) return modifier;
  else return config;
}

function setData(someConfig, somePath, newValue) {
  return getSetData(someConfig, somePath, true, newValue);
}
function getData(someConfig, somePath, newValue) {
  return getSetData(someConfig, somePath, false);
}
// give a path into an object literal as a string
// get pointer on last leaf
// if an array with indice like .position[0]

function getSetData(someConfig, somePath, set = false, newValue = null) {
  let cut = somePath.split(".");
  // advance on chain in order starting at root
  let wagon = someConfig;
  let lastIndice = cut.length - 1;
  for (let i = 0; i < cut.length; i++) {
    let name = cut[i];
    let last = i == lastIndice;
    // ------ name with indice ? ex: position[0]
    if (name.includes("[")) {
      // extract indice
      let subName = name.split("["); // "position", "0]"
      indice = parseInt(subName[1].split("]")[0]); // 0
      name = subName[0];
      // check name
      let leaf = wagon[name] ?? null;
      if (!leaf) {
        console.debug(
          "unknown key: '" +
            name +
            "' at destination. Path is:'" +
            somePath +
            "'"
        );
        return leaf;
      }
      wagon = leaf; // array dry
      // check indice
      if (indice < 0 || indice >= leaf.length) {
        console.error(
          "wrong indice:" +
            indice +
            " on array:'" +
            name +
            "' from :'" +
            somePath +
            "'"
        );
        return null;
      }
      //
      if (set && last) {
        wagon[indice] = newValue;
        return wagon[indice];
      }
      if (last) return wagon[indice]; // if last it's get due to previous
      // not last, next leaf
      wagon = wagon[indice];
      continue; // if do prefer than else else
    }
    // ------ this is not an array with indice , just a name
    let leaf = wagon[name] ?? null;
    if (!leaf) {
      console.error(
        "unknown key: '" + name + "' at destination. Path is:'" + somePath + "'"
      );
      return leaf;
    }
    if (set && last) {
      wagon[name] = newValue;
      return wagon[name];
    }
    // else next leaf
    wagon = leaf;
    if (last) return wagon;
  }
}
// retourne un pointeur et un éventuel index
