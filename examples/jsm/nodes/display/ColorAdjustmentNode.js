import TempNode from '../core/TempNode.js';
import { addNodeClass } from '../core/Node.js';
import { addNodeElement, tslFn, nodeProxy, float, vec3, mat3 } from '../shadernode/ShaderNode.js';

const saturationNode = tslFn( ( { color, adjustment } ) => {

	color = color.temp();
	color.rgb = adjustment.mix( color.rgb.luminance(), color.rgb );
	return color;

} );

const vibranceNode = tslFn( ( { color, adjustment } ) => {

	color = color.temp();

	const average = color.r.add( color.g, color.b ).div( 3.0 );

	const mx = color.r.max( color.g, color.b );
	const amt = mx.sub( average ).mul( adjustment, - 3.0 );

	color.rgb = amt.mix( color.rgb, mx );
	return color;

} );

const hueNode = tslFn( ( { color, adjustment } ) => {

	color = color.temp();

	const RGBtoYIQ = mat3( 0.299, 0.587, 0.114, 0.595716, - 0.274453, - 0.321263, 0.211456, - 0.522591, 0.311135 );
	const YIQtoRGB = mat3( 1.0, 0.9563, 0.6210, 1.0, - 0.2721, - 0.6474, 1.0, - 1.107, 1.7046 );

	const yiq = RGBtoYIQ.mul( color );

	const hue = yiq.z.atan2( yiq.y ).add( adjustment );
	const chroma = yiq.yz.length();

	color.rgb = YIQtoRGB.mul( vec3( yiq.x, chroma.mul( hue.cos() ), chroma.mul( hue.sin() ) ) );
	return color;

} );

class ColorAdjustmentNode extends TempNode {

	constructor( method, colorNode, adjustmentNode = float( 1 ) ) {

		super( 'vec3' );

		this.method = method;

		this.colorNode = colorNode;
		this.adjustmentNode = adjustmentNode;

	}

	setup() {

		const { method, colorNode, adjustmentNode } = this;

		const callParams = { color: colorNode, adjustment: adjustmentNode };

		let outputNode = null;

		if ( method === ColorAdjustmentNode.SATURATION ) {

			outputNode = saturationNode( callParams );

		} else if ( method === ColorAdjustmentNode.VIBRANCE ) {

			outputNode = vibranceNode( callParams );

		} else if ( method === ColorAdjustmentNode.HUE ) {

			outputNode = hueNode( callParams );

		} else {

			console.error( `${ this.type }: Method "${ this.method }" not supported!` );

		}

		return outputNode;

	}

}

ColorAdjustmentNode.SATURATION = 'saturation';
ColorAdjustmentNode.VIBRANCE = 'vibrance';
ColorAdjustmentNode.HUE = 'hue';

export default ColorAdjustmentNode;

export const saturation = nodeProxy( ColorAdjustmentNode, ColorAdjustmentNode.SATURATION );
export const vibrance = nodeProxy( ColorAdjustmentNode, ColorAdjustmentNode.VIBRANCE );
export const hue = nodeProxy( ColorAdjustmentNode, ColorAdjustmentNode.HUE );

export const lumaCoeffs = vec3( 0.2125, 0.7154, 0.0721 );
export const luminance = ( color, luma = lumaCoeffs ) => luma.dot( color.rgb );

addNodeElement( 'saturation', saturation );
addNodeElement( 'vibrance', vibrance );
addNodeElement( 'hue', hue );
addNodeElement( 'luminance', luminance );

addNodeClass( 'ColorAdjustmentNode', ColorAdjustmentNode );
