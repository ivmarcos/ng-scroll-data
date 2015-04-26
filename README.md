# ng-scroll-data
Scroll pagination for large data using angularjs

## Features:

* Just a array slicer
* Fine tuning with attributes

## Usage example:

Require `ng-scroll-data` to your project and use this syntax in your templates:

```html
<ng-scroll-data ng-scroll-step-down="8" ng-scroll-step-up="3" ng-scroll-limit="40" ng-scroll-items="data"/>

<table>
		<tbody ng-repeat="model in data | ngScrollPaginator : ngScrollLimit : ngScrollBegin" >
			<tr>
				<td>
					{{ model.id }}
				</td>
			</tr>
		</tbody>
</table>
```



