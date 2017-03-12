import {h, Component} from 'preact';

// TODO: Polyfill intersection observer for UAs without support
// Then remove the conditional checks and use it.

export default class LazyImage extends Component {
  constructor() {
    super();

    this.componentIntersectionChanged = this.componentIntersectionChanged.bind(this);
    this.subscribedToReadyState = false;
    this.supportIntersectionObserver = 'IntersectionObserver' in window;
  }

  unregisterObserver() {
    if (this.observer) {
      // Unregister Observer
      this.observer.unobserve(this.image);
      // thank you, we don't need you anymore
      this.observer.disconnect();
      this.observer = null;
    }
  }
  componentIntersectionChanged(entries, observer) {
    const entry = entries && entries[0];
    if (entry.isIntersecting) {
      this.image.src = this.props.src;
      this.unregisterObserver();
    }
  }

  componentWillUnmount() {
    if (this.supportIntersectionObserver) {
      this.unregisterObserver();
      this.image.removeAttribute('src');
      //this.image.src = 'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=';
      // This is a super tiny image.
    }
  }

  componentWillMount() {
    if (this.supportIntersectionObserver) {
      this.observer = new IntersectionObserver(this.componentIntersectionChanged);
    }
  }
  componentDidMount() {
    if (this.supportIntersectionObserver) {
      if (document.readyState !== 'complete' && !this.subscribedToReadyState) {
        this.subscribedToReadyState = true;
        document.addEventListener('readystatechange', this.componentDidMount, false);
      }

      this.subscribedToReadyState = false;
      document.removeEventListener('readystatechange', this.componentDidMount, false);
      this.observer.observe(this.image);
    }
  }

  render({width=40, height=40, classNames, alt, src, background='transparent'}) {
    return (
      <img 
        class={classNames} 
        alt={alt} 
        width={width} 
        height={height}
        src={this.supportIntersectionObserver ? null : src}
        style={`background: ${background}`}
        ref={(image) => { this.image = image; }}
      />
    );
  }
}