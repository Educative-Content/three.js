import { Color, Matrix3, Matrix4, Vector2, Vector3, Vector4 } from 'three';

export const getNodesKeys = ( object ) => {

	const props = [];

	for ( const name in object ) {

		const value = object[ name ];

		if ( value && value.isNode === true ) {

			props.push( name );

		}

	}

	return props;

};

export const getValueType = ( value ) => {

	if ( typeof value === 'number' ) {

		return 'float';

	} else if ( typeof value === 'boolean' ) {

		return 'bool';

	} else if ( value instanceof Vector2 ) {

		return 'vec2';

	} else if ( value instanceof Vector3 ) {

		return 'vec3';

	} else if ( value instanceof Vector4 ) {

		return 'vec4';

	} else if ( value instanceof Matrix3 ) {

		return 'mat3';

	} else if ( value instanceof Matrix4 ) {

		return 'mat4';

	} else if ( value instanceof Color ) {

		return 'color';

	}

	return null;

};

export const getValueFromType = ( type, ...params ) => {

	const last4 = type?.slice( - 4 );

	if ( type === 'color' ) {

		return new Color( ...params );

	} else if ( last4 === 'vec2' ) {

		return new Vector2( ...params );

	} else if ( last4 === 'vec3' ) {

		return new Vector3( ...params );

	} else if ( last4 === 'vec4' ) {

		return new Vector4( ...params );

	} else if ( last4 === 'mat3' ) {

		return new Matrix3( ...params );

	} else if ( last4 === 'mat4' ) {

		return new Matrix4( ...params );

	} else if ( type === 'bool' ) {

		return false;

	} else if ( ( type === 'float' ) || ( type === 'int' ) || ( type === 'uint' ) ) {

		return 0;

	}

	return null;

};
