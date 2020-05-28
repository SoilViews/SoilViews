import React from 'react';
import { FormControlLabel, Checkbox, Grid } from '@material-ui/core';
// import Favorite from '@material-ui/icons/Favorite';
// import FavoriteBorder from '@material-ui/icons/FavoriteBorder';

import styles from './NewCheckboxes.module.css'

export const NewCheckboxes = ( { crops, handleCropChange } ) => {

    return (
        <Grid container justify="center">
            <Grid item xs={12} md={6}>
                <FormControlLabel
                    className={styles.label}
                    control={
                        <Checkbox
                            checked={crops.Fruits}
                            onChange={handleCropChange}
                            name="Fruits"
                            color="primary"
                        />
                    }
                    label="Fruits:"
                />
                <span className={styles.subCrop}>Apples, Pears, Plums, Peaches, Cherries</span>
            </Grid>
            <Grid item xs={12} md={6}>
                <FormControlLabel
                    className={styles.label}
                    control={
                        <Checkbox
                            checked={crops.Vegetables}
                            onChange={handleCropChange}
                            name="Vegetables"
                            color="primary"
                            // icon={<FavoriteBorder />} 
                            // checkedIcon={<Favorite />}
                        />
                    }
                    label="Vegetables:"
                />
                <span className={styles.subCrop}>Tomatoes, Peppers, Cabbage</span>
            </Grid>
            <Grid item xs={12} md={6}>
                <FormControlLabel
                    className={styles.label}
                    control={
                        <Checkbox
                            checked={crops.Protein}
                            onChange={handleCropChange}
                            name="Protein"
                            color="primary"
                        />
                    }
                    label="Protein:"
                />
                <span className={styles.subCrop}>Soy, Quinoa, Peanuts</span>
            </Grid>
            <Grid item xs={12} md={6}>
                <FormControlLabel
                    className={styles.label}
                    control={
                        <Checkbox
                            checked={crops.Grains}
                            onChange={handleCropChange}
                            name="Grains"
                            color="primary"
                        />
                    }
                    label="Grains:"
                />
                <span className={styles.subCrop}>Wheat, Corn, Sunflower</span>
            </Grid>
            <Grid item xs={12} md={6}>
                <FormControlLabel
                    className={styles.label}
                    control={
                        <Checkbox
                            checked={crops.Vines}
                            onChange={handleCropChange}
                            name="Vines"
                            color="primary"
                        />
                    }
                    label="Vines:"
                />
                <span className={styles.subCrop}>Desert</span>
            </Grid>
            <Grid item xs={12} md={6}>
                <FormControlLabel
                    className={styles.label}
                    control={
                        <Checkbox
                            checked={crops.Berries}
                            onChange={handleCropChange}
                            name="Berries"
                            color="primary"
                        />
                    }
                    label="Berries:"
                />
                <span className={styles.subCrop}>Raspberries, Blackberries, Blueberries, Strawberries</span>
            </Grid>
        </Grid> //Main Grid
    );
};

