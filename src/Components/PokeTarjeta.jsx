import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Col, Card, CardBody, CardFooter, CardImg, Badge } from 'reactstrap';
import { Link } from 'react-router-dom';

const PokeTarjeta = (params) => {
  const [pokemon, setPokemon] = useState([]);
  const [imagen, setImagen] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getPokemon();
  }, []);

  const getPokemon = async () => {
    const liga = params.poke.url;
    axios.get(liga)
      .then(async (response) => {
        const respuesta = response.data;
        setPokemon(respuesta);
        if (respuesta.sprites.other.dream_world.front_default != null) {
          setImagen(respuesta.sprites.other.dream_world.front_default);
        } else {
          setImagen(respuesta.sprites.other['official-artwork'].front_default);
        }
        setIsLoading(false); // Indica que la carga ha finalizado
      })
      .catch(error => {
        console.error('Error al obtener el Pokémon:', error);
        setIsLoading(false); // Si hay un error, también se detiene la carga
      });
  }

  return (
    <Col sm='4' lg='3' className='mb-3'>
      <Link to={'/pokemon/' + pokemon.name} >
        <Card className='shadow border-4 border-warning h-100'>
          {isLoading ? ( // Si isLoading es verdadero, muestra la imagen de carga
            <CardImg src='/img/pokeloading.gif' height='200' className='p-3' />
          ) : ( // Si isLoading es falso, muestra la imagen del Pokémon
            <CardImg src={imagen} height='150' className='p-2 img-fluid  ' />
          )}
          <CardBody className='text-center'>

          </CardBody>
          <CardFooter className='bg-warning'>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <Link to={'/pokemon/' + pokemon.name} >
                <Badge pill color='danger'># {pokemon.id}</Badge>
              </Link>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <Link to={'/pokemon/' + pokemon.name} className='badge '>
                <label className='fs-4 my-2 mx-2 text-capitalize'>{pokemon.name}</label>
              </Link>
            </div>
          </CardFooter>
        </Card>
      </Link>
    </Col>
  );
}

export default PokeTarjeta;
