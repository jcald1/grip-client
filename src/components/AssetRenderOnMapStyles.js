const K_SIZE = 12;

const assetDefaultStyle = {
  // initially any map object has left top corner at lat lng coordinates
  // it's on you to set object origin to 0,0 coordinates
  position: 'absolute',
  width: K_SIZE,
  height: K_SIZE,
  left: -K_SIZE / 2,
  top: -K_SIZE / 2,

  cursor: 'pointer',
  color: 'black',
  background: 'grey',
  padding: '5px 5px',
  display: 'inline-flex',
  textAlign: 'top',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: '100%',
  transform: 'translate(-50%, -50%)'
};

const assetStyleHover = {
  ...assetDefaultStyle,
  background: 'red',
  width: K_SIZE * 1.25,
  height: K_SIZE * 1.25,
  zIndex: '9998'
};

const assetDefaultTxtStyle = {
  visibility: 'hidden'
};

const assetTxtStyleHover = {
  ...assetDefaultTxtStyle,
  fontSize: '25px',
  fontWeight: 'bold',
  visibility: 'visible',
  padding: '5px 5px',
  zIndex: '9999',
  display: 'block',
  position: 'absolute',
  bottom: '0',
  left: '0'
};

export {
  assetDefaultStyle, assetStyleHover, assetDefaultTxtStyle, assetTxtStyleHover, K_SIZE
};
