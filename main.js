import Exponent, {
  Asset,
  Components,
} from 'exponent';

import React from 'react';
import {
  Animated,
  Dimensions, 
  Easing,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import REGLParticlesScene from './REGLParticlesScene';

let { height, width } = Dimensions.get('window');

const { Lottie: Animation } = Exponent.DangerZone;

class App extends React.Component {
  state = {
    isReady: false,
  };

  componentWillMount() {
    this._cacheResourcesAsync();
  }

  render() {
    if (!this.state.isReady) {
      return <Components.AppLoading />;
    }

    return (
      <Demo />
    );
  }

  async _cacheResourcesAsync() {
    const assets = [
      require('./assets/trippy-vines.3gp'),
      // require('./assets/logo.json'),
    ];

    for (let asset of assets) {
      await Asset.fromModule(asset).downloadAsync();
    }

    this.setState({ isReady: true });
  }


}

class Demo extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      bounceValue: new Animated.Value(0),
      spinValue: new Animated.Value(0),
      progress: new Animated.Value(0),


      region: new Components.MapView.AnimatedRegion({
        latitude: 37.78825,
        longitude: -122.4324,
        latitudeDelta: 0.0922 / 56,
        longitudeDelta: 0.0421 / 26,
      }),

    };
  }

  componentDidMount() {

    let doZoom = () => {
      this.state.region.timing({
        latitude: 37.78825 + 0.1,
        longitude: -122.4324 + 1,
        latitudeDelta: 0.0922 * 26,
        longitudeDelta: 0.0421 * 56,
        duration: 3000,
      }).start(() => {
        this.state.region.timing({
          latitude: 37.78825,
          longitude: -122.4324,
          latitudeDelta: 0.0922 / 56,
          longitudeDelta: 0.0421 / 26,
          duration: 3000,
        }).start(doZoom);
      });
    };
    doZoom();

    let doBounce = () => {
      this.state.bounceValue.setValue(30);     // Start large


      Animated.spring(                          // Base: spring, decay, timing
        this.state.bounceValue,                 // Animate `bounceValue`
        {
          toValue: 1,                         // Animate to smaller size
          friction: 1,                          // Bouncier spring
        }
      ).start(doBounce);                                // Start the animation
    };
    doBounce();

    let doSpin = () => {
      this.state.spinValue.setValue(0);
      Animated.timing(
        this.state.spinValue,
        {
          toValue: 1,
          duration: 3000,
          easing: Easing.linear
        }
      ).start(doSpin);
    };
    doSpin();

    let doLottie = () => {
      this.state.progress.setValue(0);
      Animated.timing(this.state.progress, {
        toValue: 1,
        duration: 5000,
      }).start(({ finished }) => {
        if (finished) {
          this.forceUpdate();
          doLottie();
        }
      });
    };
    doLottie();
      

  }

  render() {

    const spin = this.state.spinValue.interpolate({
       inputRange: [0, 1],
       outputRange: ['0deg', '360deg']
    });

    const reverseSpin = this.state.spinValue.interpolate({
      inputRange: [0, 1],
      outputRange: ['720deg', '0deg'],
    });

    return (
      <View style={styles.container}>
        <REGLParticlesScene style={{flex: 1}} />
        <Animated.View             
          style={{
              zIndex: 2,
              position: 'absolute',
              height: 144, width: 256,
              top: 100,
              left: 100,
              transform: [                        // `transform` is an ordered array
                { scale: this.state.bounceValue}, {rotate: spin },  // Map `bounceValue` to `scale`
              ],
            }} 
          >
          <Exponent.Components.Video
            style={{
              flex: 1,
            }} 
            source={require('./assets/trippy-vines.3gp')}
          />
        </Animated.View>

        <Animated.View
          style={{
            position: 'absolute',
            top: 400,
            left: 100,
            height: 250,
            width: 400,
            transform: [{rotate: reverseSpin}],
          }} >
          <Components.MapView.Animated
            style={{flex: 1,}}
            region={this.state.region}
            onRegionChange={this.onRegionChange}
          />
        </Animated.View>

        <JustLottie />


      </View>
    );
  }
}

class JustLottie extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      progress: new Animated.Value(0),
      leftPosition: new Animated.Value(0),
      topValue: new Animated.Value(400),
    };
  }

  componentDidMount() {
    let doLottie = () => {
      this.state.progress.setValue(0);
      Animated.timing(this.state.progress, {
        toValue: 1,
        duration: 5000,
      }).start(({ finished }) => {
        if (finished) {
          this.forceUpdate();
          doLottie();
        }
      });
    };
    doLottie();

    let doSlide = () => {
      this.state.leftPosition.setValue(0);
      Animated.timing(this.state.leftPosition, {
        toValue: width - 200,
        duration: 2000,
      }).start(() => {
        Animated.timing(this.state.leftPosition, {
          toValue: 0,
          duration: 2000,
        }).start(doSlide);
      });
    };
    doSlide();
  
    let doBounce = () => {
      this.state.topValue.setValue(100);     // Start large


      Animated.spring(                          // Base: spring, decay, timing
        this.state.topValue,                 // Animate `bounceValue`
        {
          toValue: 400,                         // Animate to smaller size
          friction: 0.2,                          // Bouncier spring
        }
      ).start(doBounce);                                // Start the animation
    };
    doBounce();

  }



  render() {
    return (
      <Animated.View style={{
          top: this.state.topValue,
          left: this.state.leftPosition,
          position: 'absolute',
        }}>
        <Animation 
          style={{width: 200, height: 100}}
          source={require('./assets/logo.json') }
          progress={this.state.progress}
        />
      </Animated.View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    // alignItems: 'center',
    // justifyContent: 'center',
  },
});

// Exponent.registerRootComponent(JustLottie);
Exponent.registerRootComponent(App);

export default App;
