import { element, mock } from 'angular';
import { __decorate } from 'tslib';
import 'angular-mocks';
import { getTypeName, kebabToCamel, NgModule } from 'angular-ts-decorators';

var By = /** @class */ (function () {
    function By() {
    }
    By.css = function (selector) {
        return selector;
    };
    return By;
}());

var DebugElement = /** @class */ (function () {
    function DebugElement(selector) {
        var de = element(selector);
        de.query = this.query;
        de.nativeElement = de[0];
        return de;
    }
    DebugElement.prototype.query = function (selector) {
        return new DebugElement(selector);
    };
    return DebugElement;
}());

var ComponentFixture = /** @class */ (function () {
    function ComponentFixture(element$$1) {
        this.element = element$$1;
        this._isDestroyed = false;
        this.componentInstance = element$$1;
    }
    /**
     * Trigger a change detection cycle for the component.
     */
    ComponentFixture.prototype.detectChanges = function () {
        // this.element.scope().$digest();
        this.componentInstance.$onInit();
    };
    ComponentFixture.prototype.detectChangesDOM = function ($div, bindings) {
        var compile = null;
        mock.inject(function ($compile, $rootScope) {
            var $scope = $rootScope.$new();
            Object.assign($scope, bindings);
            compile = $compile($div)($scope);
            compile.scope().$digest();
        });
        this.debugElement = new DebugElement(compile);
        this.nativeElement = this.debugElement.nativeElement;
    };
    /**
     * Trigger component destruction.
     */
    ComponentFixture.prototype.destroy = function () {
        if (!this._isDestroyed) {
            // this.element.detach();
            this.componentInstance.$onDestroy();
            this._isDestroyed = true;
        }
    };
    return ComponentFixture;
}());

var _testBed = null;
/** @internal */
var DynamicTestModuleId = 'DynamicTestModule';
// let _nextRootElementId = 0;
/**
 * @whatItDoes Configures and initializes environment for unit testing and provides methods for
 * creating components and services in unit tests.
 * @description
 *
 * TestBed is the primary api for writing unit tests for Angular applications and libraries.
 */
var TestBed = /** @class */ (function () {
    function TestBed() {
        this._providers = [];
        this._declarations = [];
        this._imports = [];
        this._activeFixtures = [];
        this._moduleRef = null;
        this._instantiated = false;
    }
    /**
     * Allows overriding default providers, directives, pipes, modules of the test injector,
     * which are defined in test_injector.js
     */
    TestBed.configureTestingModule = function (moduleDef) {
        getTestBed().configureTestingModule(moduleDef);
        return TestBed;
    };
    TestBed.resetTestingModule = function () {
        getTestBed().resetTestingModule();
        return TestBed;
    };
    TestBed.compileComponents = function () { return getTestBed().compileComponents(); };
    TestBed.createComponent = function (component) {
        return getTestBed().createComponent(component);
    };
    TestBed.get = function (token) {
        token = typeof token === 'string' ? token : getTypeName(token);
        return getTestBed().get(token);
    };
    TestBed.prototype.get = function (token) {
        this._initIfNeeded();
        if (token === TestBed) {
            return this;
        }
        var result = null;
        mock.inject(["" + token, function (token) {
                result = token;
            }]);
        return result;
    };
    TestBed.prototype.configureTestingModule = function (moduleDef) {
        var _a, _b, _c;
        if (moduleDef.providers) {
            (_a = this._providers).push.apply(_a, moduleDef.providers);
        }
        if (moduleDef.declarations) {
            (_b = this._declarations).push.apply(_b, moduleDef.declarations);
        }
        if (moduleDef.imports) {
            (_c = this._imports).push.apply(_c, moduleDef.imports);
        }
    };
    TestBed.prototype.resetTestingModule = function () {
        this._moduleRef = null;
        this._providers = [];
        this._declarations = [];
        this._imports = [];
        this._instantiated = false;
        this._activeFixtures.forEach(function (fixture) {
            try {
                fixture.destroy();
            }
            catch (e) {
                console.error('Error during cleanup of component', fixture.componentInstance);
            }
        });
        this._activeFixtures = [];
    };
    TestBed.prototype.compileComponents = function () {
        this._initIfNeeded();
    };
    TestBed.prototype.createComponent = function (component) {
        var _this = this;
        this._initIfNeeded();
        // const componentFactory = null; // this._compiler.getComponentFactory(component);
        //
        // if (!componentFactory) {
        //   throw new Error(
        //     `Cannot create the component ${component['name']} as it was not imported into the testing module!`);
        // }
        // const rootElId = `root${_nextRootElementId++}`;
        // testComponentRenderer.insertRootElement(rootElId);
        var initComponent = function () {
            // const componentRef = componentFactory.create(null, [], `#${rootElId}`, this._moduleRef);
            var componentRef = _this._compileComponent(component);
            return new ComponentFixture(componentRef);
        };
        var fixture = initComponent();
        this._activeFixtures.push(fixture);
        return fixture;
    };
    TestBed.prototype._initIfNeeded = function () {
        if (this._instantiated) {
            return;
        }
        this._moduleRef = this._createModule();
        this._instantiated = true;
    };
    TestBed.prototype._createModule = function () {
        // const providers = this._providers.concat([{provide: TestBed, useValue: this}]);
        // const declarations = [...this._declarations];
        // const imports = [this.ngModule, this._imports];
        var providers = this._providers;
        var declarations = this._declarations;
        var imports = this._imports;
        var DynamicTestModule = /** @class */ (function () {
            function DynamicTestModule() {
            }
            DynamicTestModule = __decorate([
                NgModule({ id: DynamicTestModuleId, providers: providers, declarations: declarations, imports: imports })
            ], DynamicTestModule);
            return DynamicTestModule;
        }());
        return mock.module(DynamicTestModuleId);
    };
    TestBed.prototype._compileComponent = function (component) {
        var componentName = getTypeName(component);
        // const selector = camelToKebab(componentName);
        // const $div = `<${selector}></${selector}>`;
        var element$$1 = null;
        mock.inject(function ($compile, $rootScope, $componentController) {
            var $scope = $rootScope.$new();
            element$$1 = $componentController(componentName, {
                $scope: $scope,
                $element: element('<div></div>')
            });
        });
        element$$1.componentName = kebabToCamel(componentName);
        return element$$1;
    };
    return TestBed;
}());
function getTestBed() {
    return _testBed = _testBed || new TestBed();
}

export { By, ComponentFixture, DebugElement, DynamicTestModuleId, TestBed, getTestBed };