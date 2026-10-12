<?php

namespace App\Http\Controllers;
use Illuminate\Http\Exceptions\HttpResponseException;

abstract class Controller
{
    /**
     *
     */
    protected function dynamicQuery(string $model_alias, $request, $relations = null, ?string $not_null = null){
    $supported_models = [
        'projects' => 'App\Models\Project',
        'hpages'   => 'App\Models\RemotePage',
        'hsites'   => 'App\Models\RemoteSite',
    ];

    if(!array_key_exists($model_alias,$supported_models)){
        throw new HttpResponseException(
            redirect()->back()->withErrors("status", "Please select at least 'status' or 'marker' for filtering.")
        );
    }

    $model = new $supported_models[$model_alias]();
    $query = $model::query();

    $hasStatus = !empty($request->selectors['status']);
    $hasMarker = !empty($request->selectors['marker']);

    if (!$hasStatus && !$hasMarker) {
        throw new HttpResponseException(
            redirect()->back()->withErrors("status", "Please select at least 'status' or 'marker' for filtering.")
        );
    }

    $fillable    = $model->getFillable();
    $comparisons = $request->comparison_type ?? [];

    if (!empty($request->selectors) && is_array($request->selectors)) {

        foreach ($request->selectors as $column => $value) {
            if (empty($value) || $column === 'count') {
                continue;
            }

            $operator = $comparisons[$column] ?? '=';
            $value    = $operator === 'like' ? "%{$value}%" : $value;

            if ($column === 'date') {
                $query->whereDate($model->getTable() . '.updated_at', $operator, $value);
                continue;
            }

            if (in_array($column, $fillable)) {
                $query->where($column, $operator, $value);
            } else {
                info("Security alert: Ignored unfillable filtering column [{$column}] for model {$model_alias}");
            }
        }

        if (!empty($request->selectors['count'])) {
            $query->take(intval($request->selectors['count']));
        }
    }

    if ($not_null && in_array($not_null, $fillable)) {
        $query->whereNotNull($not_null);
    }

    if ($relations) {
        $query->with($relations);
    }

      return $query->orderBy('id', 'asc');
    }
}
