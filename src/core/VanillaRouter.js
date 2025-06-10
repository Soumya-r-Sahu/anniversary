/**
 * Vanilla JavaScript Router - Anniversary Website v4.0.0
 * Pure JavaScript routing without React Router dependencies
 */

class VanillaRouter {
  constructor(options = {}) {
    this.routes = new Map();
    this.middlewares = [];
    this.currentRoute = null;
    this.previousRoute = null;
    this.history = [];
    this.isNavigating = false;
    
    // Configuration
    this.config = {
      hashMode: true,
      basePath: '/anniversary-website',
      scrollToTop: true,
      animateTransitions: true,
      transitionDuration: 300,
      ...options
    };
    
    // Navigation history
    this.navigationHistory = [];
    this.historyIndex = -1;
    
    this.init();
  }

  init() {
    // Listen for route changes
    if (this.config.hashMode) {
      window.addEventListener('hashchange', (event) => {
        this.handleRouteChange(event);
      });
    } else {
      window.addEventListener('popstate', (event) => {
        this.handleRouteChange(event);
      });
    }
    
    // Handle initial route
    window.addEventListener('load', () => {
      this.handleInitialRoute();
    });
    
    // Handle link clicks
    document.addEventListener('click', (event) => {
      this.handleLinkClick(event);
    });
    
    console.log('🛤️ Vanilla Router initialized');
  }

  // Add route
  addRoute(path, handler, options = {}) {
    const route = {
      path: this.normalizePath(path),
      handler,
      middleware: options.middleware || [],
      meta: options.meta || {},
      params: {},
      query: {}
    };
    
    this.routes.set(route.path, route);
    return this;
  }

  // Add multiple routes
  addRoutes(routes) {
    routes.forEach(route => {
      this.addRoute(route.path, route.handler, route.options);
    });
    return this;
  }

  // Add global middleware
  addMiddleware(middleware) {
    this.middlewares.push(middleware);
    return this;
  }

  // Navigate to route
  navigate(path, options = {}) {
    if (this.isNavigating) {
      return Promise.resolve();
    }
    
    const normalizedPath = this.normalizePath(path);
    const shouldReplace = options.replace || false;
    
    return this.performNavigation(normalizedPath, shouldReplace, options);
  }

  // Navigate back
  back() {
    if (this.canGoBack()) {
      window.history.back();
    }
  }

  // Navigate forward
  forward() {
    if (this.canGoForward()) {
      window.history.forward();
    }
  }

  // Replace current route
  replace(path, options = {}) {
    return this.navigate(path, { ...options, replace: true });
  }

  // Redirect to route
  redirect(fromPath, toPath) {
    this.addRoute(fromPath, () => {
      this.replace(toPath);
    });
  }

  // Check if can go back
  canGoBack() {
    return this.historyIndex > 0;
  }

  // Check if can go forward
  canGoForward() {
    return this.historyIndex < this.navigationHistory.length - 1;
  }

  // Get current route
  getCurrentRoute() {
    return this.currentRoute;
  }

  // Get route parameters
  getParams() {
    return this.currentRoute ? this.currentRoute.params : {};
  }

  // Get query parameters
  getQuery() {
    return this.currentRoute ? this.currentRoute.query : {};
  }

  // Handle initial route
  handleInitialRoute() {
    const currentPath = this.getCurrentPath();
    this.performNavigation(currentPath, true, { initial: true });
  }

  // Handle route changes
  async handleRouteChange(event) {
    if (this.isNavigating) {
      return;
    }
    
    const newPath = this.getCurrentPath();
    await this.performNavigation(newPath, false, { fromPopState: true });
  }

  // Handle link clicks
  handleLinkClick(event) {
    const link = event.target.closest('a');
    if (!link) return;
    
    const href = link.getAttribute('href');
    if (!href || href.startsWith('http') || href.startsWith('mailto:') || href.startsWith('tel:')) {
      return;
    }
    
    // Check if it's a hash link or router link
    if (this.config.hashMode && href.startsWith('#')) {
      event.preventDefault();
      this.navigate(href.slice(1));
    } else if (!this.config.hashMode && href.startsWith('/')) {
      event.preventDefault();
      this.navigate(href);
    }
  }

  // Perform navigation
  async performNavigation(path, replace = false, options = {}) {
    if (this.isNavigating) {
      return;
    }
    
    this.isNavigating = true;
    
    try {
      const route = this.findRoute(path);
      if (!route) {
        await this.handle404(path);
        return;
      }
      
      // Parse parameters and query
      route.params = this.extractParams(route.path, path);
      route.query = this.extractQuery();
      
      // Execute global middleware
      const middlewareResult = await this.executeMiddleware([...this.middlewares, ...route.middleware], route);
      if (middlewareResult === false) {
        return; // Navigation cancelled by middleware
      }
      
      // Update browser URL
      this.updateURL(path, replace);
      
      // Update navigation history
      this.updateNavigationHistory(path, replace);
      
      // Execute route transition
      await this.executeRouteTransition(route, options);
      
      // Update current route
      this.previousRoute = this.currentRoute;
      this.currentRoute = route;
      
      // Scroll to top if enabled
      if (this.config.scrollToTop && !options.preserveScroll) {
        this.scrollToTop();
      }
      
      // Dispatch navigation event
      this.dispatchNavigationEvent('navigate', route);
      
    } catch (error) {
      console.error('Navigation error:', error);
      await this.handleNavigationError(error, path);
    } finally {
      this.isNavigating = false;
    }
  }

  // Find route by path
  findRoute(path) {
    // Try exact match first
    if (this.routes.has(path)) {
      return { ...this.routes.get(path), matchedPath: path };
    }
    
    // Try pattern matching
    for (const [routePath, route] of this.routes) {
      if (this.matchRoute(routePath, path)) {
        return { ...route, matchedPath: path };
      }
    }
    
    return null;
  }

  // Match route patterns (basic implementation)
  matchRoute(routePath, actualPath) {
    if (routePath === actualPath) return true;
    
    // Handle dynamic segments (:param)
    const routeSegments = routePath.split('/');
    const actualSegments = actualPath.split('/');
    
    if (routeSegments.length !== actualSegments.length) {
      return false;
    }
    
    return routeSegments.every((segment, index) => {
      if (segment.startsWith(':')) {
        return true; // Dynamic segment matches anything
      }
      return segment === actualSegments[index];
    });
  }

  // Extract parameters from path
  extractParams(routePath, actualPath) {
    const params = {};
    const routeSegments = routePath.split('/');
    const actualSegments = actualPath.split('/');
    
    routeSegments.forEach((segment, index) => {
      if (segment.startsWith(':')) {
        const paramName = segment.slice(1);
        params[paramName] = actualSegments[index];
      }
    });
    
    return params;
  }

  // Extract query parameters
  extractQuery() {
    const query = {};
    const queryString = window.location.search;
    
    if (queryString) {
      const urlParams = new URLSearchParams(queryString);
      for (const [key, value] of urlParams) {
        query[key] = value;
      }
    }
    
    return query;
  }

  // Execute middleware
  async executeMiddleware(middlewares, route) {
    for (const middleware of middlewares) {
      try {
        const result = await middleware(route, this);
        if (result === false) {
          return false; // Cancel navigation
        }
      } catch (error) {
        console.error('Middleware error:', error);
        return false;
      }
    }
    return true;
  }

  // Execute route transition
  async executeRouteTransition(route, options = {}) {
    if (this.config.animateTransitions && !options.initial) {
      await this.animatePageTransition();
    }
    
    // Execute route handler
    if (typeof route.handler === 'function') {
      await route.handler(route.params, route.query, route);
    }
  }

  // Animate page transition
  async animatePageTransition() {
    const mainContent = document.getElementById('main-content');
    if (!mainContent) return;
    
    // Fade out
    mainContent.style.opacity = '0';
    mainContent.style.transform = 'translateY(20px)';
    
    // Wait for animation
    await new Promise(resolve => setTimeout(resolve, this.config.transitionDuration / 2));
    
    // Fade in
    mainContent.style.opacity = '1';
    mainContent.style.transform = 'translateY(0)';
    
    // Wait for completion
    await new Promise(resolve => setTimeout(resolve, this.config.transitionDuration / 2));
  }

  // Update browser URL
  updateURL(path, replace = false) {
    const fullPath = this.config.hashMode ? `#${path}` : `${this.config.basePath}${path}`;
    
    if (replace) {
      if (this.config.hashMode) {
        window.location.replace(fullPath);
      } else {
        window.history.replaceState({}, '', fullPath);
      }
    } else {
      if (this.config.hashMode) {
        window.location.hash = path;
      } else {
        window.history.pushState({}, '', fullPath);
      }
    }
  }

  // Update navigation history
  updateNavigationHistory(path, replace = false) {
    if (replace) {
      this.navigationHistory[this.historyIndex] = path;
    } else {
      this.historyIndex++;
      this.navigationHistory = this.navigationHistory.slice(0, this.historyIndex);
      this.navigationHistory.push(path);
    }
  }

  // Get current path
  getCurrentPath() {
    if (this.config.hashMode) {
      return window.location.hash.slice(1) || '/';
    } else {
      // Handle GitHub Pages base path
      let path = window.location.pathname;
      if (this.config.basePath && path.startsWith(this.config.basePath)) {
        path = path.substring(this.config.basePath.length) || '/';
      }
      return path;
    }
  }

  // Normalize path
  normalizePath(path) {
    if (!path || path === '') return '/';
    if (!path.startsWith('/')) path = '/' + path;
    
    // Handle GitHub Pages base path
    if (!this.config.hashMode && this.config.basePath && path !== '/') {
      // Make sure to not double-add the base path
      if (!path.startsWith(this.config.basePath)) {
        path = this.config.basePath + path;
      }
    }
    
    return path.replace(/\/+/g, '/').replace(/\/$/, '') || '/';
  }

  // Handle 404 errors
  async handle404(path) {
    console.warn(`Route not found: ${path}`);
    
    // Try to find a 404 route
    const notFoundRoute = this.routes.get('/404') || this.routes.get('*');
    if (notFoundRoute) {
      await notFoundRoute.handler();
    } else {
      // Default 404 handling
      this.showDefaultNotFound(path);
    }
    
    this.dispatchNavigationEvent('notFound', { path });
  }

  // Show default 404 page
  showDefaultNotFound(path) {
    const mainContent = document.getElementById('main-content');
    if (mainContent) {
      mainContent.innerHTML = `
        <div class="not-found-page">
          <div class="not-found-content">
            <h1>💔 Page Not Found</h1>
            <p>The page "${path}" doesn't exist in our love story.</p>
            <button class="love-action-primary" onclick="window.anniversaryRouter?.navigate('/')">
              Go Home
            </button>
          </div>
        </div>
      `;
    }
  }

  // Handle navigation errors
  async handleNavigationError(error, path) {
    console.error('Navigation error:', error);
    
    const mainContent = document.getElementById('main-content');
    if (mainContent) {
      mainContent.innerHTML = `
        <div class="navigation-error">
          <div class="error-content">
            <h1>💔 Navigation Error</h1>
            <p>There was an error navigating to "${path}".</p>
            <button class="love-action-primary" onclick="window.location.reload()">
              Reload Page
            </button>
          </div>
        </div>
      `;
    }
    
    this.dispatchNavigationEvent('error', { error, path });
  }

  // Scroll to top
  scrollToTop() {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
  }

  // Dispatch navigation events
  dispatchNavigationEvent(type, detail) {
    const event = new CustomEvent(`router:${type}`, {
      detail: {
        ...detail,
        timestamp: Date.now(),
        router: this
      }
    });
    document.dispatchEvent(event);
  }

  // Get navigation history
  getHistory() {
    return [...this.navigationHistory];
  }

  // Clear history
  clearHistory() {
    this.navigationHistory = [];
    this.historyIndex = -1;
  }

  // Destroy router
  destroy() {
    window.removeEventListener('hashchange', this.handleRouteChange);
    window.removeEventListener('popstate', this.handleRouteChange);
    window.removeEventListener('load', this.handleInitialRoute);
    document.removeEventListener('click', this.handleLinkClick);
    
    this.routes.clear();
    this.middlewares = [];
    this.navigationHistory = [];
    this.currentRoute = null;
    this.previousRoute = null;
  }
}

// Router middleware helpers
VanillaRouter.middleware = {
  // Authentication middleware
  auth: (requiredRole = null) => (route, router) => {
    const user = window.anniversaryCore?.getState()?.getState('user:authenticated');
    if (!user) {
      router.navigate('/login');
      return false;
    }
    if (requiredRole && user.role !== requiredRole) {
      router.navigate('/unauthorized');
      return false;
    }
    return true;
  },
  
  // Loading middleware
  loading: (route, router) => {
    const loader = document.getElementById('page-loader');
    if (loader) {
      loader.style.display = 'flex';
    }
    return true;
  },
  
  // Analytics middleware
  analytics: (route, router) => {
    // Track page view
    window.anniversaryCore?.getState()?.setState('analytics:pageView', {
      path: route.path,
      timestamp: Date.now()
    });
    return true;
  },
  
  // Meta tags middleware
  meta: (route, router) => {
    if (route.meta.title) {
      document.title = route.meta.title;
    }
    if (route.meta.description) {
      let metaDesc = document.querySelector('meta[name="description"]');
      if (!metaDesc) {
        metaDesc = document.createElement('meta');
        metaDesc.setAttribute('name', 'description');
        document.head.appendChild(metaDesc);
      }
      metaDesc.setAttribute('content', route.meta.description);
    }
    return true;
  }
};

// Make VanillaRouter globally available
window.VanillaRouter = VanillaRouter;

export default VanillaRouter;
