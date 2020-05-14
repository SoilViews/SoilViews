import React from 'react';
import { Card, CardContent, Typography, Grid } from '@material-ui/core'

import styles from './SelectedCropsCards.module.css'

export const SelectedCropsCards = ({ selectedCrops, getArea, getLandCoordinates }) => {
    return (
        <div>
            <Typography variant="h5" >
            Please review and submit your order:
            </Typography>
            <Typography variant="body" >
            You selected the following crops:
            </Typography>
            <Grid container spacing={3} className={styles.selected}>
                {selectedCrops.map((crop) =>
                    <Grid item component={Card} className={styles.cropCard} key={crop}>
                        <CardContent className={styles.crop}>
                            <Typography>
                                {crop}
                            </Typography>
                        </CardContent>
                    </Grid>
                    )}
            </Grid>
            <Typography variant="body" >
            Total land area: 
            {getArea}
            </Typography>
            <Typography variant="body" >
            Loaction:  
            {getLandCoordinates}
            </Typography>
        </div>
    );
}

export default SelectedCropsCards;